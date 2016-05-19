'use strict'

const express = require('express');
const path = require('path');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Router = require('express').Router;
const router = new Router();

const roomsfile = './server/rooms.json';
const usersfile = './server/users.json';

let rooms = [];
let socketIds = [];
let users = [];

const fs = require('fs');

function readRooms() {
  fs.readFile(roomsfile, 'utf8', (err, data) => {
    if (err) throw err;
    rooms = JSON.parse(data);
    socketIds = [];
    for (let i = 0; i < rooms.length; ++i) {
      socketIds.push([null, null, null, null]);
    }
    console.log(rooms);
  });
}

function readUsers() {
  fs.readFile(usersfile, 'utf8', (err, data) => {
    if (err) throw err;
    users = JSON.parse(data);
    console.log(users);
  });
}

function saveRooms() {
  fs.writeFile(roomsfile, JSON.stringify(rooms), (err) => {
    if (err) throw err;
    console.log('saveRooms: It\'s saved!');
  });
}

function saveUsers() {
  fs.writeFile(usersfile, JSON.stringify(users), (err) => {
    if (err) throw err;
    console.log('saveUsers: It\'s saved!');
  });
}

function createRoom(roomname, username) {
  rooms.push({
    name: roomname,
    owner: username,
    num_of_people: 1,
    seats: [null, null, null, null],
    biddings: [],
    cards: null,
    observers: [username],
    status: 'not_yet_started', // bidding,
    nextMovement: null,
    lastBid: null,
  });
  socketIds.push([null, null, null, null]);
  saveRooms();
}

function getRoomIndexByName(roomname) {
  for (let i = 0, length = rooms.length; i < length; ++i) {
    if (roomname === rooms[i].name) {
      return i;
    }
  }
  return -1;
}

function sitInRoom(socketId, roomIndex, username, index) {
  if (index < 0 || index > 3) {
    return false;
  }
  if (roomIndex === -1 || rooms[roomIndex].seats[index] !== null) return false;
  for (let i = 0; i < rooms[roomIndex].seats.length; ++i) {
    if (rooms[roomIndex].seats[i] === username) return false;
  }
  rooms[roomIndex].seats[index] = username;
  socketIds[roomIndex][index] = socketId;
  saveRooms();

  return true;
}

function randomInteger(maxNum) { // 0 ~ maxNum - 1
  return Math.floor((Math.random() * maxNum));
}

function dealTheCards(roomIndex) {
  if (roomIndex > -1 && roomIndex < socketIds.length) {
    const deck = [];
    const suits = [[], [], [], []];
    const pokerSuits = [];
    for (let i = 0; i < 52; ++i) {
      deck.push(i);
    }
    for (let i = 0; i < 3; ++i) {
      const initLength = deck.length;
      for (let j = 0; j < 13; ++j) {
        const k = randomInteger(initLength - j);
        suits[i].push(deck[k]);
        deck.splice(k, 1);
      }
    }
    suits[3] = deck.slice();
    for (let i = 0; i < 4; ++i) {
      suits[i].sort((a, b) => (a - b));
      const pokerSuit = [[], [], [], []];
      for (let j = 0; j < 13; ++j) {
        const theSuit = Math.floor(suits[i][j] / 13);
        const theNumber = suits[i][j] % 13 + 1;
        pokerSuit[theSuit].push(theNumber);
      }
      pokerSuits.push(pokerSuit);
    }
    console.log('suits: ', suits);
    console.log('pokerSuits: ', pokerSuits);

    for (let i = 0; i < 4; ++i) {
      io.sockets.connected[socketIds[roomIndex][i]].emit('deal_suit', pokerSuits[i]);
    }
  }
}

function checkToDeal(roomIndex) {
  let shouldDeal = false;
  if (roomIndex !== -1) {
    shouldDeal = true;
    const seats = rooms[roomIndex].seats;
    const ids = socketIds[roomIndex];
    for (let i = 0; i < seats.length && i < ids.length; ++i) {
      if (seats[i] === null || ids[i] === null) {
        shouldDeal = false;
        break;
      }
    }
  }
  if (shouldDeal) {
    dealTheCards(roomIndex);
  }
  return shouldDeal;
}

function statusChange(roomname, info) {
  io.to(roomname).emit('status_change', info);
  const roomIndex = getRoomIndexByName(roomname);
  if (info === 'start_bidding') {
    rooms[roomIndex].status = 'bidding';
  } else if (info === 'start_playing') {
    rooms[roomIndex].status = 'playing';
  }
}

function nextMovement(roomname, roomIndex, direction) {
  io.to(roomname).emit('next_movement', {
    username: rooms[roomIndex].seats[direction],
    direction,
    movement: 'bid',
  });
  rooms[roomIndex].nextMovement = direction;
}

function emitBid(roomname, newBid) {
  io.to(roomname).emit('someone_bid', newBid);
}

function bid(roomname, username, data) {
  console.log('bid: ', roomname, username, data);
  const roomIndex = getRoomIndexByName(roomname);
  if (roomIndex === -1) {
    return;
  }

  let direction = 4;
  if (rooms[roomIndex].biddings.length !== 0) {
    for (let i = 3; i >= 0; --i) {
      if (rooms[roomIndex].biddings[rooms[roomIndex].biddings.length - 1][i] !== null) {
        direction = i + 1;
        break;
      }
    }
  }

  console.log('direction: ', direction);
  console.log('biddings: ', rooms[roomIndex].biddings);
  if (direction === 4) {
    rooms[roomIndex].biddings.push([null, null, null, null]);
    direction = 0;
  }
  const length = rooms[roomIndex].biddings.length;
  rooms[roomIndex].biddings[length - 1][rooms[roomIndex].nextMovement] = data;
  rooms[roomIndex].nextMovement = (rooms[roomIndex].nextMovement + 1) % 4;
  let shouldEndBidding = false;

  const newBid = { direction: (rooms[roomIndex].nextMovement + 3) % 4, bid: data };
  if (data === 'Pass') {
    if (rooms[roomIndex].lastBid.direction === rooms[roomIndex].nextMovement) {
      shouldEndBidding = true;
    }
  } else {
    rooms[roomIndex].lastBid = newBid;
  }

  emitBid(roomname, newBid);

  if (shouldEndBidding) {
    statusChange(roomname, 'start_playing');
  } else {
    nextMovement(roomname, roomIndex, rooms[roomIndex].nextMovement);
  }
}

function getBid(roomname, username, data) {
  console.log('getBid: ', roomname, username, data);
  const roomIndex = getRoomIndexByName(roomname);
  if (roomIndex === -1) {
    console.log('room doesn\'t exist: ', roomname);
    return false;
  }
  const room = rooms[roomIndex];
  if (room.seats[room.nextMovement] !== username) {
    console.log('not his turn to bid: ', username);
    return false;
  } else {
    const lastBid = room.lastBid;
    if (data === 'Pass') {
      return true;
    } else if (data === 'X') {
      if ((lastBid.direction % 2) !== room.nextMovement % 2 &&
          lastBid.bid !== 'X' && lastBid.bid !== 'XX') {
        return true;
      } else {
        return false;
      }
    } else if (data === 'XX') {
      if ((lastBid.direction % 2) !== room.nextMovement % 2 &&
          lastBid.bid === 'X') {
        return true;
      } else {
        return false;
      }
    } else {
      let lastValidBidding = null;
      const biddings = room.biddings;
      for (let i = biddings.length - 1; i >= 0; --i) {
        for (let j = 3; j >= 0; --j) {
          const bidding = biddings[i][j];
          if (bidding !== null && bidding.suit !== undefined && bidding.level !== undefined) {
            lastValidBidding = bidding;
          }
        }
      } if (lastValidBidding === null || lastValidBidding.level < data.level ||
          (lastValidBidding.level === data.level && lastValidBidding.suit < data.suit)) {
        return true;
      } else {
        return false;
      }
    }
  }
}

readRooms();
readUsers();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

router.get('/users/', (req, res) => {
  res.status(200);
  res.json(users);
});

router.get('/rooms/', (req, res) => {
  res.status(200);
  res.json(rooms);
});

router.get('/rooms/:roomname', (req, res) => {
  let index = -1;
  for (let i = 0, length = rooms.length; i < length; ++i) {
    if (req.params.roomname === rooms[i].name) {
      index = i;
      break;
    }
  }
  if (index === -1) {
    res.status(404);
    res.json('Not Found...');
  } else {
    res.status(200);
    const tempRoom = rooms[index];
    tempRoom.cards = null;
    res.json(tempRoom);
  }
});

router.get('/createRoom/:roomname/:username', (req, res) => {
  let index = -1;
  for (let i = 0, length = rooms.length; i < length; ++i) {
    if (req.params.roomname === rooms[i].name) {
      index = i;
      break;
    }
  }
  const found = (index !== -1);
  if (!found) {
    createRoom(req.params.roomname, req.params.username);
  }

  res.status(200);
  res.json(!found); // succeed = !found
});

router.post('/users', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('username: ', username);
  console.log('password: ', password);
  let index = -1;
  for (let i = 0, length = users.length; i < length; ++i) {
    if (username === users[i].username) {
      index = i;
      break;
    }
  }
  if (req.body.login) {
    if (index === -1) {
      res.status(404);
      res.json('This username does not exist.');
    } else {
      if (users[index].password !== password) {
        res.status(404);
        res.json('Wrong password.');
      } else {
        res.status(200);
        res.json('Succeed login.');
      }
    }
  } else {
    if (index === -1) {
      res.status(200);
      res.json('Succeed register.');

      users.push({
        username,
        password,
      });
      saveUsers();
    } else {
      res.status(404);
      res.json('Sorry, but this username is already taken.');
    }
  }
});

router.get('/logOut/:username', (req, res) => {
  const index = users.indexOf(req.params.username);

  if (index > -1) {
    users.splice(index, 1);
    saveUsers();
  }

  res.status(200);
  res.json(index > -1);
});

router.use((err, req, res) => {
  // console.log("error occurs: " + err.message);
  res.status(err.status || 500);
  res.send(err);
});

app.use('/api', router);
app.use('*', (req, res) => {
  res.render('index');
  // res.sendFile(path.join(__dirname, '..', 'index.html'));
});

io.on('connection', (socket) => {
  let roomname = '';
  let username = '';
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });

  socket.on('enter_room_request', data => {
    console.log(data);
    socket.join(data.roomname);
    socket.emit('msg', `You entered ${data.roomname}.`);
    roomname = data.roomname;
    username = data.username;
    console.log('socket: ', socket);
  });

  socket.on('sit', (data) => {
    console.log('sit: ', data);
    console.log('rooms: ', socket.rooms);
    console.log('roomname: ', roomname);
    console.log('username: ', username);
    const roomIndex = getRoomIndexByName(roomname);
    if (sitInRoom(socket.id, roomIndex, username, data)) {
      io.to(roomname).emit('someone_sit_down', {
        username,
        index: data,
      });
      if (checkToDeal(roomIndex)) {
        statusChange(roomname, 'start_bidding');
        nextMovement(roomname, roomIndex, 0);
      }
    } else {
      socket.emit('msg', `The seat ${data} is not available.`);
    }
  });

  socket.on('bid', (data) => {
    if (getBid(roomname, username, data)) {
      bid(roomname, username, data);
    } else {
      socket.emit('msg', { message: 'Your bid is not allowed.', bid: data });
    }
  });

  // socket.join('Room1');
  // io.to('Room1').emit('msg', 'You entered Room1.');
  // socket.leave('Room1');
  // io.to('Room1').emit('msg', 'Are you still there?');

  socket.on('disconnect', () => {
    console.log('disconnected...');
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
} else if (app.get('env') === 'production') {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: 'None',
    });
  });
}

module.exports = server;
