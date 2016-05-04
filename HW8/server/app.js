const express = require('express');
const path = require('path');
const logger = require('morgan');
const api = require('./api');
var  nunjucks = require('nunjucks');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

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
}

// production error handler
// no stacktraces leaked to user
else if (app.get('env') === 'production') {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: "None",
    });
  });
}

module.exports = app;
