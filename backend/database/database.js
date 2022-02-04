const sqlite = require('sqlite3');
const dbConfig = require('config').get('database');
const fs = require('fs');
const createHttpError = require('http-errors');
const { tables } = require('../objects/database/tables');

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
  queries2: {
    getSavedLocationsByUserId: `SELECT * FROM ${
      tables.saved_location.name
    } AS sl JOIN ${tables.location.name} AS l ON l.${
      tables.location().pk_location_id.name
    } = sl.${tables.saved_location().fk_location_id.name} JOIN ${
      tables.country_code.name
    } AS c ON c.${tables.country_code().pk_country_code_id.name} = l.${
      tables.location().fk_country_code_id.name
    } JOIN ${tables.state_code.name} AS s ON s.${
      tables.state_code().pk_state_code_id.name
    } = l.${tables.location().fk_state_code_id.name} WHERE sl.${
      tables.saved_location().fk_user_id.name
    } = ?`,
    saveFavorite: `INSERT INTO ${tables.saved_location.name} (${
      tables.saved_location().fk_user_id.name
    }, ${tables.saved_location().fk_location_id.name}) VALUES (?, ?)`,
    getLocation: `SELECT * FROM ${tables.location.name} AS l WHERE l.${
      tables.location().pk_location_id.name
    } = ?`,
    getWeatherDataDayByLocationIdAndDate: `SELECT * FROM ${
      tables.weather_data_day.name
    } AS wd WHERE wd.${
      tables.weather_data_day().fk_location_id.name
    } = ? AND wd.${tables.weather_data_day().date.name} = ?`,
    getWeatherDataDayByLocationId: `SELECT * FROM ${
      tables.weather_data_day.name
    } AS wd WHERE wd.${tables.weather_data_day().fk_location_id.name} = ?`,
    getWeatherDataTimeByWeatherDataDayId: `SELECT * FROM ${
      tables.weather_data_time.name
    } AS wt WHERE wt.${
      tables.weather_data_time().fk_weather_data_day_id.name
    } = ?`,
    saveChangedPassword: `UPDATE ${tables.user.name} SET ${
      tables.user().password.name
    } = ? WHERE ${tables.user().pk_user_id.name} = ?`,
    deleteUser: `DELETE FROM ${tables.user.name} WHERE ${
      tables.user().pk_user_id.name
    } = ?`,
    getUser: {
      query: `SELECT * FROM ${tables.user.name} AS u WHERE ${
        tables.user().pk_user_id.name
      } = ?`,
      from: tables.user(),
    },
    registerUser: `INSERT INTO ${tables.user.name} (${
      tables.user().email_address.name
    }, ${tables.user().password.name}) VALUES (?, ?)`,
    getUserByEmail: {
      query: `SELECT * FROM ${tables.user.name} AS u WHERE ${
        tables.user().email_address.name
      } = ?`,
      from: tables.user(),
    },
    getUserByEmailAndPassword: {
      query: `SELECT * FROM ${tables.user.name} AS u WHERE ${
        tables.user().email_address.name
      } = ? AND ${tables.user().password.name} = ?`,
      from: tables.user(),
    },
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
          reject(
            new Error(err + ' on query ' + insertParamsIntoQuery(sql, params))
          );
        } else {
          resolve(rows);
        }
      });
    });
  },
  async all_throws404(sql, params) {
    let rows = await this.all(sql, params);
    if (!rows.length) {
      throw createHttpError.NotFound(
        'No rows on query: ' + insertParamsIntoQuery(sql, params)
      );
    }
    return rows;
  },
  run_throws400(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) {
          if (err.errno == 19) {
            reject(
              createHttpError.BadRequest(
                err + ' on query ' + insertParamsIntoQuery(sql, params)
              )
            );
          } else {
            reject(
              new Error(err + ' on query ' + insertParamsIntoQuery(sql, params))
            );
          }
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
          reject(
            new Error(err + ' on query ' + insertParamsIntoQuery(sql, params))
          );
        } else {
          resolve(row);
        }
      });
    });
  },
  async get_throws404(sql, params) {
    let row = await this.get(sql, params);
    if (!row) {
      throw createHttpError.NotFound(
        'No row on query: ' + insertParamsIntoQuery(sql, params)
      );
    }
    return row;
  },
};

function insertParamsIntoQuery(query, params) {
  let i = 0;
  let newQuery = '';
  for (const c of query) {
    if (c == '?') {
      newQuery += params[i];
      i++;
    } else {
      newQuery += c;
    }
  }

  return newQuery;
}
