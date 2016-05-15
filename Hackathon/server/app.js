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
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data); // eslint-disable-line no-console
  });
});

module.exports = server;
