const database = require('../database');

async function getWeatherDataDayId(date) {
  let row = await database.get(database.queries.getWeatherDataDayId, date);
  return row.pk_weather_data_day_id;
}

module.exports = { getWeatherDataDayId };
