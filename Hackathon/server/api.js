'use strict'

const Router = require('express').Router;
const router = new Router();

const users = [
  'Harvey',
];

const rooms = [
  { name: 'First Room', owner: 'Harvey', num_of_people: 1 },
];

router.get('/users/', (req, res) => {
  res.status(200);
  res.json(users);
});

router.get('/rooms/', (req, res) => {
  res.status(200);
  res.json(rooms);
});

router.get('/users/:username', (req, res) => {
  console.log(req.params.username);
  console.log(users);
  let found = false;
  for (let i = 0, length = users.length; i < length; ++i) {
    if (req.params.username === users[i]) {
      found = true;
    }
  }
  if (found === false) {
    users.push(req.params.username);
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

router.use((err, req, res) => {
  // console.log("error occurs: " + err.message);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
