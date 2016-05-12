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
  console.log(rooms);
});

fs.readFile(usersfile, 'utf8', (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
  console.log(users);
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

// const rooms = [
//   { name: 'First Room', owner: 'Harvey', num_of_people: 1 },
// ];

router.get('/users/', (req, res) => {
  res.status(200);
  res.json(users);
});

router.get('/rooms/', (req, res) => {
  res.status(200);
  res.json(rooms);
});

router.get('/createRoom/:roomname/:username', (req, res) => {
  console.log(req.params);
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
    });
    saveRooms();
  }

  res.status(200);
  res.json(!found); // succeed = !found
});

router.get('/users/:username', (req, res) => {
  let found = false;
  const index = users.indexOf(req.params.username);
  if (index > -1) found = true;
  if (found === false) {
    users.push(req.params.username);
    saveUsers();
  }

  res.status(200);
  res.json(found);

  // if (found === false) {
  //   const err = new Error();
  //   err.status = 404;
  //   err.message = 'No such user with username: ${req.params.username}';
  //   next(err);
  // }
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
