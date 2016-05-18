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
let users = [];

let nsp_of_rooms = [];
const fs = require('fs');

function initializeNsp(roomname) {
  const nsp = io.of(`/${roomname}`);
  console.log('nsp: ', nsp);
  nsp.on('connection', (socket) => {
    console.log('someone connected');
    socket.emit('reply', 'connection received');
  });

  nsp_of_rooms.push(nsp);
}


function initializeNsps() {
  for (let i = 0, length = rooms.length; i < length; ++i) {
    initializeNsp(rooms[i].name);
  }
}

function readRooms() {
  fs.readFile(roomsfile, 'utf8', (err, data) => {
    if (err) throw err;
    rooms = JSON.parse(data);
    console.log(rooms);
    initializeNsps();
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
    observers: [username],
  });
  initializeNsp(roomname);
  saveRooms();
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
    res.json(rooms[index]);
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

io.on('connection', (socket) => {
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });

  socket.on('enter_room_request', data => {
    console.log(data);
    socket.join(data);
    socket.emit('msg', `You entered ${data}.`);
  });

  // socket.join('Room1');
  // io.to('Room1').emit('msg', 'You entered Room1.');
  // socket.leave('Room1');
  // io.to('Room1').emit('msg', 'Are you still there?');

  socket.on('disconnect', () => {
    console.log('disconnected...');
  });
});

module.exports = server;
