const coordinatesByLocationName = require('./objects/apis/openWeather/coordinatesByLocationName');
const coordinatesByZipOrPostCode = require('./objects/apis/openWeather/coordinatesByZipOrPostCode');
const currentAndForecastWeatherData = require('./objects/apis/openWeather/currentAndForecastWeatherData');
const reverseGeocoding = require('./objects/apis/openWeather/reverseGeocoding');
const astronomy = require('./objects/database/tables/astronomy');
const country_code = require('./objects/database/tables/country_code');
const location = require('./objects/database/tables/location');
const moon = require('./objects/database/tables/moon');
const saved_location = require('./objects/database/tables/saved_location');
const sky_state = require('./objects/database/tables/sky_state');
const sqlite_sequence = require('./objects/database/tables/sqlite_sequence');
const state_code = require('./objects/database/tables/state_code');
const user = require('./objects/database/tables/user');
const weather_data_day = require('./objects/database/tables/weather_data_day');
const weather_data_hour = require('./objects/database/tables/weather_data_hour');
const wind_direction = require('./objects/database/tables/wind_direction');

const objectBinds = {
  apis: {
    openWeather: {
      extern: {
        coordinatesByLocationName,
        coordinatesByZipOrPostCode,
        currentAndForecastWeatherData,
        reverseGeocoding,
      },
      intern: {
        cronjob: {
          lastUpdatedWeatherData: 0,
        },
      },
    },
  },
  database: {
    tables: {
      astronomy,
      country_code,
      location,
      moon,
      saved_location,
      sky_state,
      sqlite_sequence,
      state_code,
      user,
      weather_data_day,
      weather_data_hour,
      wind_direction,
    },
    whereOperators: {
      equal: '=',
      greaterThan: '>',
      lessThan: '<',
      greaterThanOrEqual: '>=',
      lessThanOrEqual: '<=',
      notEqual1: '<>',
      notEqual2: '!=',
      between: 'BETWEEN',
      like: 'LIKE',
      in: 'IN',
    },
  },
};

module.exports = objectBinds;
