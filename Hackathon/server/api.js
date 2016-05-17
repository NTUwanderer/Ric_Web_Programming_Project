'use strict'

const Router = require('express').Router;
const router = new Router();

const roomsfile = './server/rooms.json';
const usersfile = './server/users.json';

let rooms = [];
let users = [];
const fs = require('fs');

fs.readFile(roomsfile, 'utf8', (err, data) => {
  if (err) throw err;
  rooms = JSON.parse(data);
});

fs.readFile(usersfile, 'utf8', (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

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
    rooms.push({
      name: req.params.roomname,
      owner: req.params.username,
      num_of_people: 0,
      seats: [null, null, null, null],
      observers: [],
    });
    saveRooms();
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

module.exports = router;
