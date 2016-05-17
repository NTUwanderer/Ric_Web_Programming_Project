'use strict'

const express = require('express');
const path = require('path');
const logger = require('morgan');
const api = require('./api');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const roomsfile = './server/rooms.json';
const usersfile = './server/users.json';

let rooms = [];
let users = [];
let nsp_of_rooms = [];
const fs = require('fs');

function initializeNsp(nsp) {
  nsp.on('connection', (socket) => {
    console.log('someone connected');
    socket.emit('reply', 'connection received');
  });
}

function refreshNsps(tempRooms) {
  for (let i = 0, length = tempRooms.length; i < length; ++i) {
    if (i >= rooms.length) {
      for (let j = i; j < length; ++j) {
        delete io.nsps[`/${tempRooms[j].name}`];
      }
      tempRooms.splice(i, length - i);
      nsp_of_rooms.splice(i, length - i);
      break;
    } else if (tempRooms[i].name !== rooms[i].name) {
      delete io.nsps[`/${tempRooms[i].name}`];
      tempRooms.splice(i, 1);
      nsp_of_rooms.splice(i, 1);
      --length;
      --i;
    }
  }

  for (let i = tempRooms.length, length = rooms.length; i < length; ++i) {
    const nsp = io.of(`/${rooms[i].name}`);
    console.log('nsp: ', nsp);
    initializeNsp(nsp);
    nsp_of_rooms.push(nsp);
  }
}

function readRooms() {
  fs.readFile(roomsfile, 'utf8', (err, data) => {
    if (err) throw err;
    const tempRooms = rooms;
    rooms = JSON.parse(data);
    console.log(rooms);
    refreshNsps(tempRooms);
  });
}

function readUsers() {
  fs.readFile(usersfile, 'utf8', (err, data) => {
    if (err) throw err;
    users = JSON.parse(data);
    console.log(users);
  });
}

readRooms();
readUsers();

fs.watch(roomsfile, () => {
  readRooms();
});

fs.watch(usersfile, () => {
  readUsers();
});

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

app.use('/api', api);
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
  console.log('socket: ', socket);
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data); // eslint-disable-line no-console
  });

  socket.on('disconnect', () => {
    console.log('disconnected...');
  });
});

module.exports = server;
