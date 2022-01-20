const database = require('../database');
const config = require('../../../config/config');
const time = require('../../help/time');
const { getDate: getDateFromDateString } = require('../../help/time');
const minutes =
  config.backend.api.openWeatherApi.execution.dataUpdate.OneCallApi.interval
    .minutes;

module.exports = {
  last_updated_date_time: function getLocaleDateTimeString(time) {
    return new Date(time).toLocaleString();
  },
};
