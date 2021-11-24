const { tables } = require('../../generate/objects/database/database');

module.exports = {
  '/': {
    get: {
      request: {
        body: {
          [tables.location().city_name().json]: tables.location().city_name()
            .validation,

          [tables.country_code().country_name().json]: tables
            .country_code()
            .country_name().validation,

          [tables.state_code().state_name().json]: tables
            .state_code()
            .state_name().validation,

          [tables.location().zip_code().json]: tables.location().zip_code()
            .validation,

          [tables.location().latitude().json]: tables.location().latitude()
            .validation,

          [tables.location().longitude().json]: tables.location().longitude()
            .validation,
        },
      },
      response: {
        body: {
          [tables.location().pk_location_id().json]: tables
            .location()
            .pk_location_id().validation,

          [tables.location().city_name().json]: tables.location().city_name()
            .validation,

          [tables.location().fk_state_code_id().json]: tables
            .location()
            .fk_state_code_id().validation,

          [tables.location().fk_country_code_id().json]: tables
            .location()
            .fk_country_code_id().validation,

          [tables.location().zip_code().json]: tables.location().zip_code()
            .validation,

          [tables.location().latitude().json]: tables.location().latitude()
            .validation,

          [tables.location().longitude().json]: tables.location().longitude()
            .validation,
        },
      },
    },
  },
  past: {
    get: {
      request: {
        params: {
          [tables.location().pk_location_id().json]: tables
            .location()
            .pk_location_id().validation,
        },
        body: {
          [tables.weather_data_day().date().json]: tables
            .weather_data_day()
            .date().validation,
        },
      },
      response: {
        body: {
          [tables.weather_data_day().date().json]: tables
            .weather_data_day()
            .date().validation,

          [tables.weather_data_day().max_temperature().json]: tables
            .weather_data_day()
            .max_temperature().validation,

          [tables.weather_data_day().min_temperature().json]: tables
            .weather_data_day()
            .min_temperature().validation,

          [tables.weather_data_day().fk_sky_state_name().json]: tables
            .weather_data_day()
            .fk_sky_state_name().validation,

          [tables.weather_data_day().wind_speed().json]: tables
            .weather_data_day()
            .wind_speed().validation,

          [tables.weather_data_day().wind_gust().json]: tables
            .weather_data_day()
            .wind_gust().validation,

          [tables.weather_data_day().wind_degree().json]: tables
            .weather_data_day()
            .wind_degree().validation,

          [tables.weather_data_day().fk_wind_direction().json]: tables
            .weather_data_day()
            .fk_wind_direction().validation,

          [tables.weather_data_day().precipitation_probability().json]: tables
            .weather_data_day()
            .precipitation_probability().validation,

          [tables.weather_data_day().humidity().json]: tables
            .weather_data_day()
            .humidity().validation,

          [tables.weather_data_day().air_pressure().json]: tables
            .weather_data_day()
            .air_pressure().validation,

          [tables.weather_data_day().sunrise().json]: tables
            .weather_data_day()
            .sunrise().validation,

          [tables.weather_data_day().sunset().json]: tables
            .weather_data_day()
            .sunset().validation,

          [tables.weather_data_day().weather_report().json]: tables
            .weather_data_day()
            .weather_report().validation,
        },
      },
    },
  },
  presentFuture: {
    get: {
      request: {
        params: {
          [tables.location().pk_location_id().json]: tables
            .location()
            .pk_location_id().validation,
        },
      },
      response: {
        body: {
          current: {
            [tables.weather_data_current().date().json]: tables
              .weather_data_current()
              .date().validation,

            [tables.weather_data_current().temperature().json]: tables
              .weather_data_current()
              .temperature().validation,

            [tables.weather_data_current().fk_sky_state_name().json]: tables
              .weather_data_current()
              .fk_sky_state_name().validation,

            [tables.weather_data_current().wind_speed().json]: tables
              .weather_data_current()
              .wind_speed().validation,

            [tables.weather_data_current().wind_gust().json]: tables
              .weather_data_current()
              .wind_gust().validation,

            [tables.weather_data_current().wind_degree().json]: tables
              .weather_data_current()
              .wind_degree().validation,

            [tables.weather_data_current().fk_wind_direction().json]: tables
              .weather_data_current()
              .fk_wind_direction().validation,

            [tables.weather_data_current().humidity().json]: tables
              .weather_data_current()
              .humidity().validation,

            [tables.weather_data_current().air_pressure().json]: tables
              .weather_data_current()
              .air_pressure().validation,

            [tables.weather_data_current().sunrise().json]: tables
              .weather_data_current()
              .sunrise().validation,

            [tables.weather_data_current().sunset().json]: tables
              .weather_data_current()
              .sunset().validation,

            [tables.weather_data_current().weather_report().json]: tables
              .weather_data_current()
              .weather_report().validation,
          },
          daily: {
            [tables.weather_data_day().date().json]: tables
              .weather_data_day()
              .date().validation,

            [tables.weather_data_day().max_temperature().json]: tables
              .weather_data_day()
              .max_temperature().validation,

            [tables.weather_data_day().min_temperature().json]: tables
              .weather_data_day()
              .min_temperature().validation,

            [tables.weather_data_day().fk_sky_state_name().json]: tables
              .weather_data_day()
              .fk_sky_state_name().validation,

            [tables.weather_data_day().wind_speed().json]: tables
              .weather_data_day()
              .wind_speed().validation,

            [tables.weather_data_day().wind_gust().json]: tables
              .weather_data_day()
              .wind_gust().validation,

            [tables.weather_data_day().wind_degree().json]: tables
              .weather_data_day()
              .wind_degree().validation,

            [tables.weather_data_day().fk_wind_direction().json]: tables
              .weather_data_day()
              .fk_wind_direction().validation,

            [tables.weather_data_day().precipitation_probability().json]: tables
              .weather_data_day()
              .precipitation_probability().validation,

            [tables.weather_data_day().humidity().json]: tables
              .weather_data_day()
              .humidity().validation,

            [tables.weather_data_day().air_pressure().json]: tables
              .weather_data_day()
              .air_pressure().validation,

            [tables.weather_data_day().sunrise().json]: tables
              .weather_data_day()
              .sunrise().validation,

            [tables.weather_data_day().sunset().json]: tables
              .weather_data_day()
              .sunset().validation,

            [tables.weather_data_day().weather_report().json]: tables
              .weather_data_day()
              .weather_report().validation,
          },
          hourly: {
            [tables.weather_data_time().hour().json]: tables
              .weather_data_time()
              .hour().validation,

            [tables.weather_data_time().temperature().json]: tables
              .weather_data_time()
              .temperature().validation,

            [tables.weather_data_time().felt_temperature().json]: tables
              .weather_data_time()
              .felt_temperature().validation,

            [tables.weather_data_time().fk_sky_state_name().json]: tables
              .weather_data_time()
              .fk_sky_state_name().validation,

            [tables.weather_data_time().wind_speed().json]: tables
              .weather_data_time()
              .wind_speed().validation,

            [tables.weather_data_time().wind_gust().json]: tables
              .weather_data_time()
              .wind_gust().validation,

            [tables.weather_data_time().wind_degree().json]: tables
              .weather_data_time()
              .wind_degree().validation,

            [tables.weather_data_time().fk_wind_direction().json]: tables
              .weather_data_time()
              .fk_wind_direction().validation,

            [tables.weather_data_time().precipitation_probability().json]:
              tables.weather_data_time().precipitation_probability().validation,

            [tables.weather_data_time().humidity().json]: tables
              .weather_data_time()
              .humidity().validation,

            [tables.weather_data_time().air_pressure().json]: tables
              .weather_data_time()
              .air_pressure().validation,
          },
        },
      },
    },
  },
};
