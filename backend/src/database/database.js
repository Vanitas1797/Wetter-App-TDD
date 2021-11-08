const sqlite = require('sqlite3');
const dbConfig = require('config').get('database');
const fs = require('fs');

const db = new sqlite.Database(dbConfig.storage);

const queries = {
  getAllFavoritesOfOneUser: fs
    .readFileSync('backend/src/database/queries/getAllFavoritesOfOneUser.sql')
    .toString(),
  getAllLocationsFromUserInput: fs
    .readFileSync(
      'backend/src/database/queries/getAllLocationsFromUserInput.sql'
    )
    .toString(),
  getWeatherDataPresentFuture: fs
    .readFileSync(
      'backend/src/database/queries/getWeatherDataPresentFuture.sql'
    )
    .toString(),
  saveNewLocationsFromUserInput: fs
    .readFileSync(
      'backend/src/database/queries/saveNewLocationsFromUserInput.sql'
    )
    .toString(),
  getCountryCodeIdFromCountryCode2OrCountryCode3: fs
    .readFileSync(
      'backend/src/database/queries/getCountryCodeIdFromCountryCode2OrCountryCode3.sql'
    )
    .toString(),
  deleteUserAccount: fs
    .readFileSync('backend/src/database/queries/deleteUserAccount.sql')
    .toString(),
  getUserByUsername: fs
    .readFileSync('backend/src/database/queries/getUserByUsername.sql')
    .toString(),
  postRegisterNewUser: fs
    .readFileSync('backend/src/database/queries/postRegisterNewUser.sql')
    .toString(),
  putResetPassword: fs
    .readFileSync('backend/src/database/queries/putResetPassword.sql')
    .toString(),
  getUserByUsernameOrEmail: fs
    .readFileSync('backend/src/database/queries/getUserByUsernameOrEmail.sql')
    .toString(),
};

function all(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function run(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

async function get(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = { queries, all, run, get };
