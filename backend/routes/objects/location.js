const { all } = require('../../database/database');
const { tables } = require('../../generate/objects/database/tables');

module.exports = {
  '/': {
    get: {
      request: {
        body: {
          [tables.location().city_name().json]: '',
          [tables.country_code().country_name().json]: '',
          [tables.state_code().state_name().json]: '',
          [tables.location().zip_code().json]: '',
          [tables.location().latitude().json]: 0,
          [tables.location().longitude().json]: 0,
        },
      },
      response: {
        body: {
          [tables.location().pk_location_id().json]: 0,
          [tables.location().city_name().json]: '',
          [tables.location().fk_state_code_id().json]: 0,
          [tables.location().fk_country_code_id().json]: 0,
          [tables.location().zip_code().json]: '',
          [tables.location().latitude().json]: 0,
          [tables.location().longitude().json]: 0,
        },
      },
    },
  },
  past: {
    get: {
      request: {
        params: {
          location_id: 0,
        },
        body: {
          date: '',
        },
      },
      response: {
        body: {
          [tables.weather_data_day().date().json]: '',
          [tables.weather_data_day().max_temperature().json]: 0,
          [tables.weather_data_day().min_temperature().json]: 0,
          [tables.weather_data_day().fk_sky_state_name().json]: '',
          [tables.weather_data_day().wind_speed().json]: 0,
          [tables.weather_data_day().wind_gust().json]: 0,
          [tables.weather_data_day().wind_degree().json]: 0,
          [tables.weather_data_day().fk_wind_direction().json]: '',
          [tables.weather_data_day().precipitation_probability().json]: 0,
          [tables.weather_data_day().humidity().json]: 0,
          [tables.weather_data_day().air_pressure().json]: 0,
          [tables.weather_data_day().sunrise().json]: '',
          [tables.weather_data_day().sunset().json]: '',
          [tables.weather_data_day().weather_report().json]: '',
        },
      },
    },
  },
  presentFuture: {
    get: {
      request: {
        params: {
          location_id: 0,
        },
      },
      response: {
        body: {
          current: {
            [tables.weather_data_current().date().json]: '',
            [tables.weather_data_current().temperature().json]: 0,
            [tables.weather_data_current().fk_sky_state_name().json]: '',
            [tables.weather_data_current().wind_speed().json]: 0,
            [tables.weather_data_current().wind_gust().json]: 0,
            [tables.weather_data_current().wind_degree().json]: 0,
            [tables.weather_data_current().fk_wind_direction().json]: '',
            [tables.weather_data_current().humidity().json]: 0,
            [tables.weather_data_current().air_pressure().json]: 0,
            [tables.weather_data_current().sunrise().json]: '',
            [tables.weather_data_current().sunset().json]: '',
            [tables.weather_data_current().weather_report().json]: '',
          },
          daily: {
            [tables.weather_data_day().date().json]: '',
            [tables.weather_data_day().max_temperature().json]: 0,
            [tables.weather_data_day().min_temperature().json]: 0,
            [tables.weather_data_day().fk_sky_state_name().json]: '',
            [tables.weather_data_day().wind_speed().json]: 0,
            [tables.weather_data_day().wind_gust().json]: 0,
            [tables.weather_data_day().wind_degree().json]: 0,
            [tables.weather_data_day().fk_wind_direction().json]: '',
            [tables.weather_data_day().precipitation_probability().json]: 0,
            [tables.weather_data_day().humidity().json]: 0,
            [tables.weather_data_day().air_pressure().json]: 0,
            [tables.weather_data_day().sunrise().json]: '',
            [tables.weather_data_day().sunset().json]: '',
            [tables.weather_data_day().weather_report().json]: '',
          },
          hourly: {
            [tables.weather_data_hour().hour().json]: '',
            [tables.weather_data_hour().temperature().json]: 0,
            [tables.weather_data_hour().felt_temperature().json]: 0,
            [tables.weather_data_hour().fk_sky_state_name().json]: '',
            [tables.weather_data_hour().wind_speed().json]: 0,
            [tables.weather_data_hour().wind_gust().json]: 0,
            [tables.weather_data_hour().wind_degree().json]: 0,
            [tables.weather_data_hour().fk_wind_direction().json]: '',
            [tables.weather_data_hour().precipitation_probability().json]: 0,
            [tables.weather_data_hour().humidity().json]: 0,
            [tables.weather_data_hour().air_pressure().json]: 0,
          },
        },
      },
    },
  },
};
