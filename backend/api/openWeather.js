const { default: axios } = require('axios');
const config = require('../../config/config');
const database = require('../database/database');
const { getDate, getDateString } = require('../help/time');

const minutes =
  config.backend.api.openWeatherApi.execution.dataUpdate.OneCallApi.interval
    .minutes;

module.exports = {
  /**
   *
   * @param {string} url
   */
  async getDataFromApi(url) {
    const res = await axios.get(url);
    return res;
  },
  getLocaleTime(unix, timezoneOffsetSeconds) {
    return (unix / 1000 + timezoneOffsetSeconds) * 1000;
  },
  async isUpdated(locationId) {
    let row = await database.get_throws(
      database.queries.getWeatherDataCurrent,
      locationId
    );

    let now = new Date().getTime();
    let ludt = getDate(row.last_updated_date_time);
    if (
      new Date(ludt.setMinutes(ludt.getMinutes() + minutes)).getTime() <= now
    ) {
      return false;
    }

    return true;
  },
};
