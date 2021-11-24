const { default: axios } = require('axios');
const database = require('../database');
const config = require('../../../config/development.json');
const createHttpError = require('http-errors');

async function getLocationId(latitude, longitude) {
  try {
    let row = await database.get(
      database.queries.getLocationId,
      latitude,
      longitude
    );
    if (!row) {
      const { data } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=${config.weatherApi.limit}&appid=${config.weatherApi.apiKey}`
      );
      if (!data.length) {
        throw createHttpError.NotFound();
      } else {
        for (let d of data) {
          let row1 = await database.get(database.queries.getCountry, [
            d.country,
          ]);
          let row2 = await database.get(database.queries.getState, [d.state]);
          let insertParams = [
            d.name,
            row2 ? row2.state_name : null,
            row1.country_name,
            null,
            d.lat,
            d.lon,
          ];
          await database.run(
            database.queries.saveNewLocationsFromUserInput,
            insertParams
          );
        }
        row = await database.get(
          database.queries.getLocationId,
          latitude,
          longitude
        );
        if (!row) {
          throw createHttpError.NotFound();
        }
      }
    }
    return row.pk_location_id;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  
};
