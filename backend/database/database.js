const sqlite = require('sqlite3');
const dbConfig = require('config').get('database');
const fs = require('fs');

const db = new sqlite.Database(dbConfig.storage);

const database = {
  queries: {
    getAllFavoritesOfOneUser: fs
      .readFileSync('backend/database/queries/getAllFavoritesOfOneUser.sql')
      .toString(),
    insertStateCodes: fs
      .readFileSync('backend/database/queries/insertStateCodes.sql')
      .toString(),
    getAllLocationsFromUserInput: fs
      .readFileSync(
        'backend/database/queries/getAllLocationsFromUserInput.sql'
      )
      .toString(),
    getWeatherDataPresentFuture: fs
      .readFileSync(
        'backend/database/queries/getWeatherDataPresentFuture.sql'
      )
      .toString(),
    saveNewLocationsFromUserInput: fs
      .readFileSync(
        'backend/database/queries/saveNewLocationsFromUserInput.sql'
      )
      .toString(),
    getCountry: fs
      .readFileSync('backend/database/queries/getCountry.sql')
      .toString(),
    getState: fs
      .readFileSync('backend/database/queries/getState.sql')
      .toString(),
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
      getDayAllWeathersPresentFuture: fs
      .readFileSync('backend/database/queries/getDayAllWeathersPresentFuture.sql')
      .toString(),
  },
  all(sql, params) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  run(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },
  get(sql, params) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },
};

module.exports = { database };
