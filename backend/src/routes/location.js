'use strict';

const express = require('express');
const { db, queries, all, run, get } = require('../database/database');
const { validateParamsOrQuery } = require('../validation/routes');
const createHttpError = require('http-errors');
const { default: axios } = require('axios');
const router = express.Router();

const apiKey = 'cea910880ce57c3997f3b4e5e34f25fe';
const limit = 50;

// /location
router.get('/', getLocationsBySearch);
router.get('/presentFuture', getLocationsPresentFuture);
router.get('/past', getLocationsPast);

function getLocationsBySearch(req, res, next) {
  const shouldParams = [
    'cityName',
    'countryName',
    'stateCode',
    'zipCode',
    'latitude',
    'longitude',
  ];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  } else {
    let selectParams = [
      req.body[shouldParams[0]],
      req.body[shouldParams[1]],
      req.body[shouldParams[2]],
      req.body[shouldParams[3]],
      req.body[shouldParams[4]],
      req.body[shouldParams[5]],
    ];
    db.all(
      queries.getAllLocationsFromUserInput,
      selectParams,
      async (err, rows) => {
        if (err) {
          return next(err);
        } else {
          if (rows.length) {
            return res.json(rows);
          } else {
            try {
              const response = await axios.get(
                `http://api.openweathermap.org/geo/1.0/zip?zip=${req.body.zipCode},${req.body.countryCode}&appid=${apiKey}`
              );
            } catch (error) {
              error.message += ': ' + error.response.data.message;
              console.error(error.stack);
              try {
                const response = await axios.get(
                  `http://api.openweathermap.org/geo/1.0/direct?q=${req.body.cityName},${req.body.stateCode},${req.body.countryCode}&limit=${limit}&appid=${apiKey}`
                );
                const data = response.data;
                if (!data.length) {
                  return next(createHttpError.NotFound());
                } else {
                  for (let d of data) {
                    db.get(
                      queries.getCountryCodeIdFromCountryCode2OrCountryCode3,
                      d.country,
                      async (err, row) => {
                        if (err) {
                          return next(err);
                        } else {
                          if (!row) {
                            return next(createHttpError.NotFound());
                          } else {
                            let insertParams = [
                              d.name,
                              d.state,
                              row.country,
                              '',
                              d.lat,
                              d.lon,
                            ];
                            db.run(
                              queries.saveNewLocationsFromUserInput,
                              insertParams,
                              (err) => {
                                if (err) {
                                  return next(err);
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  }
                  db.all(
                    queries.getAllLocationsFromUserInput,
                    selectParams,
                    (err, rows) => {
                      if (err) {
                        return next(err);
                      } else {
                        if (rows.length) {
                          return res.json(rows);
                        } else {
                          return next(createHttpError.NotFound());
                        }
                      }
                    }
                  );
                }
              } catch (error) {
                return next(error);
              }
            }
          }
        }
      }
    );
  }
}

function getLocationsPresentFuture(req, res, next) {}
function getLocationsPast(req, res, next) {}

module.exports = {
  router,
};
