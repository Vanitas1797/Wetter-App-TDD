const sqlite = require('sqlite3');
const dbConfig = require('config').get('database');
const fs = require('fs');
const objectBinds = require('../generate/objectBinds');
const createHttpError = require('http-errors');

const db = new sqlite.Database(dbConfig.storage);

const tables = objectBinds.database.tables;
const whereOperators = objectBinds.database.whereOperators;

const queries = {
  getAllFavoritesOfOneUser: fs
    .readFileSync('backend/database/queries/getAllFavoritesOfOneUser.sql')
    .toString(),
  getAllWeatherDataDay: fs
    .readFileSync('backend/database/queries/getAllWeatherDataDay.sql')
    .toString(),
  insertStateCodes: fs
    .readFileSync('backend/database/queries/insertStateCodes.sql')
    .toString(),
  getAllLocationsFromUserInput: fs
    .readFileSync('backend/database/queries/getAllLocationsFromUserInput.sql')
    .toString(),
  saveNewLocationsFromUserInput: fs
    .readFileSync('backend/database/queries/saveNewLocationsFromUserInput.sql')
    .toString(),
  getCountry: fs
    .readFileSync('backend/database/queries/getCountry.sql')
    .toString(),
  getState: fs.readFileSync('backend/database/queries/getState.sql').toString(),
  deleteUserAccount: fs
    .readFileSync('backend/database/queries/deleteUserAccount.sql')
    .toString(),
  getUserByUsername: fs
    .readFileSync('backend/database/queries/getUserByUsername.sql')
    .toString(),
  postRegisterNewUser: fs
    .readFileSync('backend/database/queries/postRegisterNewUser.sql')
    .toString(),
  putResetPassword: fs
    .readFileSync('backend/database/queries/putResetPassword.sql')
    .toString(),
  getUserByUsernameOrEmail: fs
    .readFileSync('backend/database/queries/getUserByUsernameOrEmail.sql')
    .toString(),
  getWeatherDataDay: fs
    .readFileSync('backend/database/queries/getWeatherDataDay.sql')
    .toString(),
  updateWeatherDataDay: fs
    .readFileSync('backend/database/queries/updateWeatherDataDay.sql')
    .toString(),
  getWindDirection: fs
    .readFileSync('backend/database/queries/getWindDirection.sql')
    .toString(),
  getLocationId: fs
    .readFileSync('backend/database/queries/getLocationId.sql')
    .toString(),
  getSkyState: fs
    .readFileSync('backend/database/queries/getSkyState.sql')
    .toString(),
  insertSkyState: fs
    .readFileSync('backend/database/queries/insertSkyState.sql')
    .toString(),
  insertWeatherDataDay: fs
    .readFileSync('backend/database/queries/insertWeatherDataDay.sql')
    .toString(),
  getWeatherDataHour: fs
    .readFileSync('backend/database/queries/getWeatherDataHour.sql')
    .toString(),
  getWeatherDataDayId: fs
    .readFileSync('backend/database/queries/getWeatherDataDayId.sql')
    .toString(),
  insertWeatherDataHour: fs
    .readFileSync('backend/database/queries/insertWeatherDataHour.sql')
    .toString(),
  updateWeatherDataHour: fs
    .readFileSync('backend/database/queries/updateWeatherDataHour.sql')
    .toString(),
  getWeatherDataDayPast: fs
    .readFileSync('backend/database/queries/getWeatherDataDayPast.sql')
    .toString(),
};

const queries2 = {};

function all(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.all(sql, ...params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (!rows.length) reject(createHttpError.NotFound());
        resolve(rows);
      }
    });
  });
}

function run(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function get(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.get(sql, ...params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) reject(createHttpError.NotFound());
        resolve(row);
      }
    });
  });
}

module.exports = { queries, queries2, all, run, get };
