const database = require('../database');

function getWeatherDataDay(date) {
  return database.get(database.queries.getWeatherDataDayId, date);
}

module.exports = { getWeatherDataDay };
