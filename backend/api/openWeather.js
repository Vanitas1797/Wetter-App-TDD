const { default: axios } = require('axios');
const config = require('../../config/config');
const database = require('../database/database');
const { getDate } = require('../help/time');

const minutes =
  config.backend.api.openWeatherApi.execution.dataUpdate.OneCallApi.interval
    .minutes;
const timezoneDE = config.backend.time.timezoneOffsetSeconds().de;

module.exports = {
  /**
   *
   * @param {string} url
   */
  async getDataFromApi(url) {
    const res = await axios.get(url);
    return res;
  },
  async isUpdated(locationId) {
    let row = await database.get_throws(
      database.queries.getWeatherDataCurrent,
      locationId
    );

    let now = new Date().getTime();
    let ludt = getDate(row.last_updated_date_time, timezoneDE);
    ludt = new Date(ludt.setSeconds(ludt.getSeconds() + 1)).getTime();
    if (ludt <= now) {
      return false;
    }

    return true;
  },
};
