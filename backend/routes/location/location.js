const express = require('express');
const config = require('../../../config/config');
const database = require('../../database/database');
const { date } = require('../../database/(dep)tables/date');
const { time } = require('../../database/(dep)tables/time');
const { sunrise } = require('../../database/(dep)tables/sunrise');
const { sunset } = require('../../database/(dep)tables/sunset');
const windDirection = require('../../database/(dep)tables/windDirection');
const currentAndForecastWeatherData = require('../../objects/apis/openWeather/currentAndForecastWeatherData');
const validation = require('../../validation/validation');
const object = require('./object');
const {
  getDataFromApi,
  getLocaleTimeInMilliseconds: getLocaleTime,
} = require('../../api/openWeather');
const coordinatesByZipOrPostCode = require('../../objects/apis/openWeather/coordinatesByZipOrPostCode');
const coordinatesByLocationName = require('../../objects/apis/openWeather/coordinatesByLocationName');
const reverseGeocoding = require('../../objects/apis/openWeather/reverseGeocoding');
const { state_code } = require('../../database/(dep)tables/state_code');
const { country_code } = require('../../database/(dep)tables/country_code');
const last_updated_date_time = require('../../database/(dep)tables/last_updated_date_time');
const { getDateTimeStringFromSeconds: getDateStringFromSeconds } = require('../../help/time');
const router = express.Router();

const apiUrls = config.backend.api.openWeatherApi.url.urls;
const openWeatherApi = config.backend.api.openWeatherApi;
const updateApiEveryTenMinutes = 1000 * 60 * 10;
const dataTemplate = object;

async function getWeatherDataDaysForecast(paramsDay) {
  let rowsDay;
  let now = new Date();
  for (let i = 0; i < openWeatherApi.execution.forecast.days; i++) {
    rowsDay = await database.all(database.queries.getWeatherDataDay, paramsDay);
    let day = new Date(now.setDate(now.getDate() + 1)).toLocaleDateString();
    paramsDay[1] = day;
  }
  paramsDay[1] = new Date().toLocaleDateString();

  return rowsDay;
}

// /location
router.get('/', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest({
      request: req,
      check: dataTemplate['/'].get.request,
    });

    let requestBody = {
      city_name: '',
      country_name: '',
      state_name: '',
      zip_code: '',
      latitude: '',
      longitude: '',
    };
    requestBody = req.body;

    let params = Object.values(requestBody);
    let rows = await database.all(
      database.queries.getAllLocationsFromUserInput,
      params
    );

    if (!rows.length) {
      if (requestBody.zip_code && requestBody.country_name) {
        let url = apiUrls.geocoding.directGeocoding.coordinatesByZipOrPostCode(
          requestBody.zip_code,
          requestBody.country_name
        );

        let apiResponse = await getDataFromApi(url);
        let data = coordinatesByZipOrPostCode;
        data = apiResponse.data;

        let insert = [
          data.name,
          await state_code(data.state),
          await country_code(data.country),
          data.zip,
          data.lat,
          data.lon,
        ];
        await database.run(database.queries.insertLocation, insert);
      } else if (
        requestBody.city_name ||
        requestBody.state_name ||
        requestBody.country_name
      ) {
        let url = apiUrls.geocoding.directGeocoding.coordinatesByLocationName(
          requestBody.city_name,
          requestBody.state_name,
          requestBody.country_name
        );
        let apiResponse = await getDataFromApi(url);
        let data = coordinatesByLocationName;
        data = apiResponse.data;

        for (const d of data) {
          let insert = [
            d.local_names.de || d.local_names.en || d.name,
            await state_code(d.state),
            await country_code(d.country),
            null,
            d.lat,
            d.lon,
          ];

          await database.run(database.queries.insertLocation, insert);
        }
      } else if (requestBody.latitude && requestBody.longitude) {
        let url = apiUrls.geocoding.reverseGeocoding.reverseGeocoding(
          requestBody.latitude,
          requestBody.longitude
        );
        let apiResponse = await getDataFromApi(url);
        let data = reverseGeocoding;
        data = apiResponse.data;

        for (const d of data) {
          let insert = [
            d.local_names.de || d.name,
            await state_code(d.state),
            await country_code(d.country),
            null,
            d.lat,
            d.lon,
          ];

          await database.run(database.queries.insertLocation, insert);
        }
      }
    }

    rows = await database.all(
      database.queries.getAllLocationsFromUserInput,
      params
    );

    const builtResponse = {
      rows: rows,
    };

    res.json(builtResponse);
  } catch (error) {
    next(error);
  }
});
router.get('/:location_id/presentFuture', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest({
      request: req,
      check: dataTemplate.presentFuture.get.request,
    });

    const now = new Date();
    // todo
    let today = now.toLocaleDateString();

    let paramsCurrent = [req.params.location_id];
    let paramsDay = [req.params.location_id, today];

    let rowsCurrent = await database.all(
      database.queries.getWeatherDataCurrent,
      paramsCurrent
    );
    let rowsDay = await getWeatherDataDaysForecast(paramsDay);

    let paramsTime = [];

    const isUpdated = await last_updated_date_time.isUpdated(
      req.params.location_id
    );

    let row = await database.get_throws(
      database.queries.getLocation,
      req.params.location_id
    );
    let url = apiUrls.oneCall.currentAndForecastWeatherData(
      row.latitude,
      row.longitude
    );
    let apiResponse = await getDataFromApi(url);
    let data = currentAndForecastWeatherData;
    data = apiResponse.data;

    if (!rowsCurrent.length) {
      let current = data.current;
      let insertCurrent = [
        req.params.location_id,
        getDateStringFromSeconds(current.dt, data.timezone_offset),
        current.temp,
        current.weather[0].description,
        current.wind_speed,
        current.wind_gust,
        current.wind_deg,
        await windDirection.wind_direction(current.wind_deg),
        current.humidity,
        current.pressure,
        getDateStringFromSeconds(current.sunrise, data.timezone_offset),
        getDateStringFromSeconds(current.sunset, data.timezone_offset),
        null,
        getDateStringFromSeconds(current.dt, data.timezone_offset),
      ];
      await database.run(
        database.queries.insertWeatherDataCurrent,
        insertCurrent
      );
    }

    if (!rowsDay.length) {
      let daily = data.daily;
      for (const day of daily) {
        let insertDaily = [
          req.params.location_id,
          getDateStringFromSeconds(day.dt, data.timezone_offset),
          day.temp.max,
          day.temp.min,
          day.weather[0].description,
          day.wind_speed,
          day.wind_gust,
          day.wind_deg,
          await windDirection.wind_direction(day.wind_deg),
          day.pop,
          day.humidity,
          day.pressure,
          getDateStringFromSeconds(day.sunrise, data.timezone_offset),
          getDateStringFromSeconds(day.sunset, data.timezone_offset),
          null,
        ];
        await database.run(database.queries.insertWeatherDataDay, insertDaily);
      }

      rowsDay = await getWeatherDataDaysForecast(paramsDay);
    }

    paramsTime = [rowsDay[0].pk_weather_data_day_id];
    let rowsTime = await database.all(
      database.queries.getWeatherDataTime,
      paramsTime
    );

    if (!rowsTime.length) {
      let hourly = data.hourly;
      for (const hour of hourly) {
        let insertHourly = [
          rowsDay[0].pk_weather_data_day_id,
          getDateStringFromSeconds(hour.dt, data.timezone_offset),
          hour.temp,
          hour.feels_like,
          hour.weather[0].description,
          hour.wind_speed,
          hour.wind_gust,
          hour.wind_deg,
          await windDirection.wind_direction(hour.wind_deg),
          hour.pop,
          hour.humidity,
          hour.pressure,
        ];
        await database.run(
          database.queries.insertWeatherDataTime,
          insertHourly
        );
      }
    }

    if (!isUpdated) {
      let updateCurrent = [
        getDateStringFromSeconds(now, 3600),
        req.params.location_id,
      ];
      await database.run(
        database.queries.updateWeatherDataCurrent,
        updateCurrent
      );

      let daily = data.daily;
      for (const day of daily) {
        let updateDaily = [
          day.temp.max,
          day.temp.min,
          day.weather[0].description,
          day.wind_speed,
          day.wind_gust,
          day.wind_deg,
          await windDirection.wind_direction(day.wind_deg),
          day.pop,
          day.humidity,
          day.pressure,
          getDateStringFromSeconds(day.sunrise, data.timezone_offset),
          getDateStringFromSeconds(day.sunset, data.timezone_offset),
          null,
          req.params.location_id,
        ];
        await database.run(database.queries.updateWeatherDataDay, updateDaily);
      }
      rowsDay = await getWeatherDataDaysForecast(paramsDay);

      let hourly = data.hourly;
      for (const hour of hourly) {
        let updateHourly = [
          hour.temp,
          hour.feels_like,
          hour.weather[0].description,
          hour.wind_speed,
          hour.wind_gust,
          hour.wind_deg,
          await windDirection.wind_direction(hour.wind_deg),
          hour.pop,
          hour.humidity,
          hour.pressure,
          rowsDay[0].pk_weather_data_day_id,
        ];
        await database.run(
          database.queries.updateWeatherDataTime,
          updateHourly
        );
      }
      rowsTime = await database.all(
        database.queries.getWeatherDataTime,
        paramsTime
      );
    }

    rowsCurrent = await database.all(
      database.queries.getWeatherDataCurrent,
      paramsCurrent
    );

    const builtResponse = {
      rows: {
        current: rowsCurrent,
        day: rowsDay,
        hour: rowsTime,
      },
    };

    res.json(builtResponse);
  } catch (error) {
    next(error);
  }
});
router.get('/:location_id/past', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest({
      request: req,
      check: dataTemplate.past.get.request,
    });

    const params = [req.params.location_id, req.body.date];

    let row = await database.get(
      database.queries.getWeatherDataDayPast,
      params
    );

    const builtResponse = { row: row };

    res.json(builtResponse);
  } catch (error) {
    next(error);
  }
});
/**
 *
 * @param {{params,query,body}} template
 * @param {{params,query,body}} request
 */
function getDbParams(template, request) {
  let dbParams = [];
  for (let data in template) {
    for (let key in template[data]) {
      dbParams.push(request[data][key]);
    }
  }
  return dbParams;
}

async function getLocationsBySearch(req, res, next) {
  try {
    const shouldParams = [
      'cityName',
      'countryName',
      'stateCode',
      'zipCode',
      'latitude',
      'longitude',
    ];
    validateParamsOrQuery(shouldParams, req.body);
    // let selectParams = [
    //   req.body[shouldParams[0]],
    //   req.body[shouldParams[1]],
    //   req.body[shouldParams[2]],
    //   req.body[shouldParams[3]],
    //   req.body[shouldParams[4]],
    //   req.body[shouldParams[5]],
    // ];
    let selectParams = Object.values(req.body);
    let rows = await database.all(
      database.queries.getAllLocationsFromUserInput,
      selectParams
    );
    if (rows.length) {
      return res.json(rows);
    } else {
      let response;
      try {
        response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/zip?zip=${req.body.zipCode},${req.body.countryCode}&appid=${config.weatherApi.apiKey}`
        );
      } catch (error) {
        error.message += ': ' + error.response.data.message;
        console.log(error.stack + '/n');
        response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${req.body.cityName},${req.body.stateCode},${req.body.countryName}&limit=${config.weatherApi.limit}&appid=${config.weatherApi.apiKey}`
        );
      }
      const data = response.data;
      if (!data.length) {
        return next(createHttpError.NotFound());
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
        let rows = await database.all(
          database.queries.getAllLocationsFromUserInput,
          selectParams
        );
        return res.json(rows);
      }
    }
  } catch (error) {
    return next(error);
  }
}

async function getLocationsPresentFuture(req, res, next) {
  try {
    const shouldParams = ['latitude', 'longitude'];
    validateParamsOrQuery(shouldParams, req.body);
    const now = new Date();
    let rows = await database.all(
      database.queries.getAllWeatherDataDay,
      req.body.latitude,
      req.body.longitude
    );
    if (
      now.getTime() - cronjob.lastUpdatedOpenWeatherApi >=
        updateApiEveryTenMinutes ||
      !rows.length
    ) {
      cronjob.lastUpdatedOpenWeatherApi = now.getTime();
      generate.updateJsonFile('backend/generate/objects/cronjob.json', cronjob);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${req.body.latitude}&lon=${req.body.longitude}&exclude=${config.weatherApi.exclude}&appid=${config.weatherApi.apiKey}&units=${config.weatherApi.units}&lang=${config.weatherApi.lang}`
      );
      currentAndForecastWeatherData = response.data;
      let current = currentAndForecastWeatherData.current;
      let daily = currentAndForecastWeatherData.daily;
      let hourly = currentAndForecastWeatherData.hourly;
      let dayTime = (time) =>
        (time + currentAndForecastWeatherData.timezone_offset) * 1000;
      for (let d of daily) {
        let date = new Date(dayTime(d.dt)).toLocaleDateString();
        let row = await database.get(
          database.queries.getWeatherDataDayId,
          date
        );
        if (!row) {
          let paramsForInsertDaily = [
            await location.getLocationId(
              currentAndForecastWeatherData.lat,
              currentAndForecastWeatherData.lon
            ),
            date,
            d.temp.max,
            d.temp.min,
            await skyState.getSkyStateName(d.weather[0].description),
            d.wind_speed,
            d.wind_gust,
            d.wind_deg,
            await windDirection.getWindDirectionName(d.wind_deg),
            d.pop,
            d.humidity,
            d.pressure,
            new Date(dayTime(d.sunrise)).toLocaleTimeString(),
            new Date(dayTime(d.sunset)).toLocaleTimeString(),
            null,
            now.getTime(),
          ];
          await database.run(
            database.queries.insertWeatherDataDay,
            paramsForInsertDaily
          );
        } else {
          let paramsForUpdateDaily = [
            d.temp.max,
            d.temp.min,
            d.weather[0].description,
            d.wind_speed,
            d.wind_gust,
            d.wind_deg,
            await windDirection.getWindDirectionName(d.wind_deg),
            d.pop,
            d.humidity,
            d.pressure,
            d.sunrise,
            d.sunset,
            null,
            now.getTime(),
            date,
          ];
          await database.run(
            database.queries.updateWeatherDataDay,
            paramsForUpdateDaily
          );
        }
      }
      for (let h of hourly) {
        let hour = parseInt(
          new Date(dayTime(h.dt)).toLocaleTimeString().slice(0, 2)
        ).toString();
        let row = await database.get(database.queries.getWeatherDataHour, hour);
        if (!row) {
          let paramsForInsertHourly = [
            await weatherDataDay.getWeatherDataDayId(
              new Date(
                (daily[0].dt + currentAndForecastWeatherData.timezone_offset) *
                  1000
              ).toLocaleDateString()
            ),
            hour,
            h.temp,
            h.feels_like,
            await skyState.getSkyStateName(h.weather[0].description),
            h.wind_speed,
            h.wind_gust,
            h.wind_deg,
            await windDirection.getWindDirectionName(h.wind_deg),
            h.pop,
            h.humidity,
            h.pressure,
          ];
          await database.run(
            database.queries.insertWeatherDataHour,
            paramsForInsertHourly
          );
        } else {
          let paramsForUpdateHourly = [
            h.temp,
            h.feels_like,
            await skyState.getSkyStateName(h.weather[0].description),
            h.wind_speed,
            h.wind_gust,
            h.wind_deg,
            await windDirection.getWindDirectionName(h.wind_deg),
            h.pop,
            h.humidity,
            h.pressure,
            hour,
          ];
          await database.run(
            database.queries.updateWeatherDataHour,
            paramsForUpdateHourly
          );
        }
      }
    }
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

function getLocationsPast(req, res, next) {
  /**
   *
   */
}

module.exports = router;
