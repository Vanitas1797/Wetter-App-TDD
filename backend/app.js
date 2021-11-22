const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', require('./routes/endpoints/user'));
app.use('/location', require('./routes/endpoints/location'));

fs.copyFileSync(
  `backend/database/db/wetter-app-copy.db`,
  `backend/database/db/wetter-app-dev.db`
);

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
