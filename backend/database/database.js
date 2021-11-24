const sqlite = require('sqlite3');
const dbConfig = require('config').get('database');
const fs = require('fs');
const createHttpError = require('http-errors');

const db = new sqlite.Database(dbConfig.storage);
module.exports = {
  queries: {
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
    getWeatherDataTime: fs
      .readFileSync('backend/database/queries/getWeatherDataTime.sql')
      .toString(),
    getWeatherDataDayId: fs
      .readFileSync('backend/database/queries/getWeatherDataDayId.sql')
      .toString(),
    insertWeatherDataTime: fs
      .readFileSync('backend/database/queries/insertWeatherDataTime.sql')
      .toString(),
    getWeatherDataDayPast: fs
      .readFileSync('backend/database/queries/getWeatherDataDayPast.sql')
      .toString(),
    getWeatherDataCurrent: fs
      .readFileSync('backend/database/queries/getWeatherDataCurrent.sql')
      .toString(),
    getLocation: fs
      .readFileSync('backend/database/queries/getLocation.sql')
      .toString(),
    insertWeatherDataCurrent: fs
      .readFileSync('backend/database/queries/insertWeatherDataCurrent.sql')
      .toString(),
    insertLocation: fs
      .readFileSync('backend/database/queries/insertLocation.sql')
      .toString(),
    getStateCode: fs
      .readFileSync('backend/database/queries/getStateCode.sql')
      .toString(),
    getCountryCode: fs
      .readFileSync('backend/database/queries/getCountryCode.sql')
      .toString(),
    updateWeatherDataCurrent: fs
      .readFileSync('backend/database/queries/updateWeatherDataCurrent.sql')
      .toString(),
      updateWeatherDataTime: fs
      .readFileSync('backend/database/queries/updateWeatherDataTime.sql')
      .toString(),
  },
  /**
   *
   * @param {string} sql
   * @param {any[]} params
   */
  all(sql, params) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          err.message += sql ? ' on query ' + sql : '';
          reject(new Error(err));
        } else {
          resolve(rows);
        }
      });
    });
  },
  async all_throws(sql, params) {
    let rows = await this.all(sql, params);
    if (!rows.length) {
      throw createHttpError.NotFound('No rows on query: ' + sql);
    }
    return rows;
  },
  run(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) {
          reject(new Error(err));
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
          reject(new Error(err));
        } else {
          resolve(row);
        }
      });
    });
  },
  async get_throws(sql, params) {
    let row = await this.get(sql, params);
    if (!row) {
      throw createHttpError.NotFound('No row on query: ' + sql);
    }
    return row;
  },
};
