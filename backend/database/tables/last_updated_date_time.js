const database = require('../database');
const config = require('../../../config/config');
const time = require('../../help/time');
const { getDateFromDateString } = require('../../help/time');
const minutes =
  config.backend.api.openWeatherApi.execution.dataUpdate.OneCallApi.interval
    .minutes;

module.exports = {
  last_updated_date_time: function getLocaleDateTimeString(time) {
    return new Date(time).toLocaleString();
  },
  async isUpdated(locationId) {
    let row = await database.get(
      database.queries.getWeatherDataCurrent,
      locationId
    );

    let now = new Date();

    if (row) {
      let ludt = new Date(getDateFromDateString(row.last_updated_date_time));
      if (new Date(ludt.setMinutes(ludt.getMinutes() + minutes)) <= now) {
        return false;
      }
    }

    return true;
  },
};
