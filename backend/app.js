const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');
const session = require('express-session');
const time = require('./help/time');
const config = require('../config/config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  // res.header('Access-Control-Max-Age', 1000 * 3600 * 24);
  next();
});

app.use(
  session({
    secret: config.backend.secrets.login_system,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: time.toMilliseconds({ mi: 5 }) },
  })
);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', require('./routes/user/user'));
app.use('/location', require('./routes/location/location'));

// fs.copyFileSync(
//   `backend/database/db/wetter-app-dev-copy.db`,
//   `backend/database/db/wetter-app-dev.db`
// );

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
    res.json(errObj);
    console.error(err.stack);
  }
});

module.exports = app;
