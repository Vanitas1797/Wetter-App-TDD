'use strict';

const express = require('express');
const { database } = require('../database/database');
const { validateParamsOrQuery } = require('../validation/routes');
const createHttpError = require('http-errors');
const { default: axios } = require('axios');
const { generate } = require('../generate/generate');
const router = express.Router();

// const currentAndForecastWeatherData = require('../objects/raw/currentAndForecastWeatherData.json');
// const cronjob = require('../objects/cronjob.json');

const apiKey = 'cea910880ce57c3997f3b4e5e34f25fe';
const limit = 50;
const exclude = 'minutely';
const units = 'metric';
const updateApiEveryTenMinutes = 1000 * 60 * 10;

// /location
router.get('/', getLocationsBySearch);
router.get('/presentFuture', getLocationsPresentFuture);
router.get('/past', getLocationsPast);

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
    let selectParams = [
      req.body[shouldParams[0]],
      req.body[shouldParams[1]],
      req.body[shouldParams[2]],
      req.body[shouldParams[3]],
      req.body[shouldParams[4]],
      req.body[shouldParams[5]],
    ];
    let rows = await database.all(
      database.queries.getAllLocationsFromUserInput,
      selectParams
    );
    if (rows.length) {
      return res.json(rows);
    } else {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/zip?zip=${req.body.zipCode},${req.body.countryCode}&appid=${apiKey}`
        );
      } catch (error) {
        error.message += ': ' + error.response.data.message;
        console.log(error.stack + '/n');
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${req.body.cityName},${req.body.stateCode},${req.body.countryName}&limit=${limit}&appid=${apiKey}`
        );
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
              row2 ? row2.state : null,
              row1.country,
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
    if (now - cronjob.lastUpdatedOpenWeatherApi >= updateApiEveryTenMinutes) {
      cronjob.lastUpdatedOpenWeatherApi = now;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${req.body.latitude}&lon=${req.body.longitude}&exclude=${exclude}&appid=${apiKey}&units=${units}`
      );
      response.data[Object.keys(currentAndForecastWeatherData)]
    } else {
    }
  } catch (error) {
    return next(error);
  }
}

function getLocationsPast(req, res, next) {}

module.exports = router;
