const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', require('./routes/user').router);
app.use('/location', require('./routes/location').router);

// error handler
app.use(function (err, req, res, next) {
  if (err) {
    let errObj = {
      error: {
        statusCode: err.statusCode || 500,
        message: err.message,
      },
    };
    res.status(errObj.error.statusCode);
    console.error(err);
    res.send(errObj);
  }
});

module.exports = app;
