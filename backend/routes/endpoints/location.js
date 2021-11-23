const express = require('express');
const database = require('../../database/database');
const { validateParamsOrQuery } = require('../../validation/routes');
const createHttpError = require('http-errors');
const { default: axios } = require('axios');
const location = require('../objects/location');
const validation = require('../../validation/validation');
const router = express.Router();

const updateApiEveryTenMinutes = 1000 * 60 * 10;
const dataTemplate = location;

// /location
router.get('/', async (req, res, next) => {});
router.get('/:location_id/presentFuture', async (req, res, next) => {
  let dbParams = getDbParams(dataTemplate.presentFuture.get, req);
  let rows = await database.all(database.queries.getWeatherDataDay, dbParams);
  res.json(rows);
});
router.get('/:location_id/past', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest({ request: req, check: dataTemplate.past.get.request });
    res.json()
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
