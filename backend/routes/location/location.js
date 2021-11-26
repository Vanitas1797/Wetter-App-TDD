const express = require('express');
const config = require('../../../config/config');
const database = require('../../database/database');
const windDirection = require('../../database/(dep)tables/windDirection');
const validation = require('../../validation/validation');
const object = require('./object');
const { getDataFromApi } = require('../../api/openWeather');
const { state_code } = require('../../database/(dep)tables/state_code');
const { country_code } = require('../../database/(dep)tables/country_code');
const {
  getDateString,
  getDate,
  getDateTimeString,
  getTimeString,
} = require('../../help/time');
const openWeather = require('../../api/openWeather');
const openWeatherResponses = require('../../objects/apis/openWeather/responses');
const { tables } = require('../../objects/database/tables');
const router = express.Router();

const currentAndForecastWeatherData =
  openWeatherResponses.oneCall.currentAndForecastWeatherData;
const reverseGeocoding = openWeatherResponses.geocoding.reverseGeocoding;
const coordinatesByZipOrPostCode =
  openWeatherResponses.geocoding.coordinatesByZipOrPostCode;
const coordinatesByLocationName =
  openWeatherResponses.geocoding.coordinatesByLocationName;
const apiUrls = config.backend.api.openWeatherApi.url.urls;
const time = config.backend.time;
const openWeatherApi = config.backend.api.openWeatherApi;
const updateApiEveryTenMinutes = 1000 * 60 * 10;
const dataTemplate = object;
const nowUnix = new Date().getTime();
const timezoneDE = time.timezoneOffsetSeconds().de;

async function getWeatherDataDaysForecast(paramsDay) {
  let now = new Date();
  let rowsDay = [];
  let params = paramsDay;
  for (let i = 0; i < openWeatherApi.execution.forecast.days; i++) {
    let rowDay = await database.get(
      database.queries.getWeatherDataDay,
      params
    );
    if (rowDay) rowsDay.push(rowDay);
    let day = now;
    day = getDateString(new Date(day.setDate(day.getDate() + 1)).getTime());
    params[1] = day;
  }
  params[1] = getDateString(now);

  return rowsDay;
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 */
async function insertRowCurrent(data) {
  let current = data.current;
  let insertCurrent = [
    data.locationId,
    getDateString(current.dt, data.timezone_offset),
    current.temp,
    current.weather[0].description,
    current.wind_speed,
    current.wind_gust,
    current.wind_deg,
    await windDirection.wind_direction(current.wind_deg),
    current.humidity,
    current.pressure,
    getTimeString(current.sunrise, data.timezone_offset),
    getTimeString(current.sunset, data.timezone_offset),
    null,
    getDateTimeString(current.dt, data.timezone_offset),
  ];
  await database.run(database.queries.insertWeatherDataCurrent, insertCurrent);
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 */
async function insertRowsDay(data) {
  let daily = data.daily;
  for (const day of daily) {
    let insertDaily = [
      data.locationId,
      getDateString(day.dt, data.timezone_offset),
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
      getTimeString(day.sunrise, data.timezone_offset),
      getTimeString(day.sunset, data.timezone_offset),
      null,
    ];
    await database.run(database.queries.insertWeatherDataDay, insertDaily);
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 * @param {{}[]} rowsDay
 */
async function insertRowsTime(data, paramsDay) {
  let rowsDay = await getRowsDay_throws(paramsDay);

  let hourly = data.hourly;
  for (const hour of hourly) {
    let insertHourly = [
      rowsDay[0].pk_weather_data_day_id,
      getTimeString(hour.dt, data.timezone_offset),
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
    await database.run(database.queries.insertWeatherDataTime, insertHourly);
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 */
async function updateRowCurrent(data) {
  let updateCurrent = [getDateTimeString(nowUnix, timezoneDE), data.locationId];
  await database.run(database.queries.updateWeatherDataCurrent, updateCurrent);
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 */
async function updateRowsDay(data) {
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
      getTimeString(day.sunrise, data.timezone_offset),
      getTimeString(day.sunset, data.timezone_offset),
      null,
      data.locationId,
    ];
    await database.run(database.queries.updateWeatherDataDay, updateDaily);
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 * @param {{}[]} rowsDay
 */
async function updateRowsTime(data, paramsDay) {
  let rowsDay = await getRowsDay_throws(paramsDay);

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
    await database.run(database.queries.updateWeatherDataTime, updateHourly);
  }
}

async function getRowCurrent(paramsCurrent) {
  let rowCurrent = await database.get(
    database.queries.getWeatherDataCurrent,
    paramsCurrent
  );
  return rowCurrent;
}

async function getRowCurrent_throws(paramsCurrent) {
  let rowCurrent = await database.get_throws(
    database.queries.getWeatherDataCurrent,
    paramsCurrent
  );
  return rowCurrent;
}

async function updateAllPresentFuture(data, paramsDay) {
  await updateRowCurrent(data);
  await updateRowsDay(data);
  await updateRowsTime(data, paramsDay);
}

async function getLocationTimezone(locationId) {
  let { timezone_offset } = await database.get(
    `SELECT timezone_offset
  FROM location
  WHERE pk_location_id = ?`,
    locationId
  );
  return timezone_offset;
}

async function insertAllPresentFuture(data, paramsDay) {
  await insertRowCurrent(data);
  await insertRowsDay(data);
  await insertRowsTime(data, paramsDay);
}

async function getRowsDay_throws(paramsDay) {
  let rowsDay = await getWeatherDataDaysForecast(paramsDay);
  if (!rowsDay) throw new Error('Rows day is empty');
  return rowsDay;
}

async function getRowsTime_throws(paramsTime) {
  let rowsTime = await database.all_throws(
    database.queries.getWeatherDataTime,
    paramsTime
  );
  return rowsTime;
}

async function apiCallCurrentAndForecastWeatherData_throws(reqParamLocationId) {
  let rowLocation = await database.get_throws(
    database.queries.getLocation,
    reqParamLocationId
  );
  let url = apiUrls.oneCall.currentAndForecastWeatherData(
    rowLocation.latitude,
    rowLocation.longitude
  );
  let apiResponse = await getDataFromApi(url);
  let data = currentAndForecastWeatherData;
  data = apiResponse.data;
  data.locationId = reqParamLocationId;
  return data;
}

async function apiCallCoordinatesByZipOrPostCode(requestBody) {
  let url = apiUrls.geocoding.directGeocoding.coordinatesByZipOrPostCode(
    requestBody.zip_code,
    requestBody.country_name
  );
  let apiResponse = await getDataFromApi(url);
  let data = coordinatesByZipOrPostCode;
  data = apiResponse.data;
  return data;
}

async function apiCallCoordinatesByLocationName(requestBody) {
  let url = apiUrls.geocoding.directGeocoding.coordinatesByLocationName(
    requestBody.city_name,
    requestBody.state_name,
    requestBody.country_name
  );
  let apiResponse = await getDataFromApi(url);
  let data = coordinatesByLocationName;
  data = apiResponse.data;
  return data;
}

async function apiCallReverseGeocoding(requestBody) {
  let url = apiUrls.geocoding.reverseGeocoding.reverseGeocoding(
    requestBody.latitude,
    requestBody.longitude
  );
  let apiResponse = await getDataFromApi(url);
  let data = reverseGeocoding;
  data = apiResponse.data;
  return data;
}

async function insertRowLocation(insert) {
  await database.run(database.queries.insertLocation, insert);
}

async function insertByCoordinatesByZipOrPostCode(data) {
  let insert = [
    data.name,
    await state_code(data.state),
    await country_code(data.country),
    data.zip,
    data.lat,
    data.lon,
  ];
  await insertRowLocation(insert);
}

async function insertByCoordinatesByLocationName(requestBody) {
  let data = await apiCallCoordinatesByLocationName(requestBody);
  for (const d of data) {
    let insert = [
      d.local_names.de || d.local_names.en || d.name,
      await state_code(d.state),
      await country_code(d.country),
      null,
      d.lat,
      d.lon,
    ];
    await insertRowLocation(insert);
  }
}

async function insertByReverseGeocoding(requestBody) {
  let data = await apiCallReverseGeocoding(requestBody);
  for (const d of data) {
    let insert = [
      d.local_names.de || d.local_names.en || d.name,
      await state_code(d.state),
      await country_code(d.country),
      null,
      d.lat,
      d.lon,
    ];
    await insertRowLocation(insert);
  }
}

async function getRowsLocationsFromUserInput(params) {
  let rows = await database.all(
    database.queries.getAllLocationsFromUserInput,
    params
  );
  return rows;
}

async function updateByCoordinatesByZipOrPostCode(data, locationId) {
  await database.run(
    `UPDATE location
  SET zip_code = ?
  WHERE pk_location_id = ?`,
    [data.zip, locationId]
  );
}

async function isCoordinatesByZipOrPostCodeInDb(data) {
  let row = await database.get(
    `SELECT *
    FROM location
    JOIN country_code ON pk_country_code_id = fk_country_code_id
    JOIN state_code ON pk_state_code_id = fk_state_code_id
    WHERE city_name = ? AND latitude = ? AND longitude = ? AND country_name = ? AND state_name = ?`,
    [data.name, data.lat, data.lon, data.country, data.state || null]
  );
  if (row) return row.pk_location_id;
  return false;
}

async function insertOrUpdateLocation(requestBody) {
  if (requestBody.zip_code && requestBody.country_name) {
    let data = await apiCallCoordinatesByZipOrPostCode(requestBody);
    let locationId = await isCoordinatesByZipOrPostCodeInDb(data);
    if (locationId) {
      await updateByCoordinatesByZipOrPostCode(data, locationId);
    } else {
      await insertByCoordinatesByZipOrPostCode(data);
    }
  } else if (
    requestBody.city_name ||
    requestBody.state_name ||
    requestBody.country_name
  ) {
    await insertByCoordinatesByLocationName(requestBody);
  } else if (requestBody.latitude && requestBody.longitude) {
    await insertByReverseGeocoding(requestBody);
  }
}

async function updateTimezoneInLocation(timezone, locationId) {
  await database.run(
    `UPDATE ${tables.location.name}
    SET ${tables.location().timezone_offset.name} = ${timezone}
    WHERE ${tables.location().pk_location_id.name} = ${locationId}`
  );
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

    let rowsLocation = await getRowsLocationsFromUserInput(params);

    if (!rowsLocation.length) {
      await insertOrUpdateLocation(requestBody);
      rowsLocation = await getRowsLocationsFromUserInput(params);
    }

    const builtResponse = {
      rows: rowsLocation,
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

    let data;

    const reqParamLocationId = req.params.location_id;
    let timezone = await getLocationTimezone(reqParamLocationId);
    if (!timezone) {
      data =
        data ||
        (await apiCallCurrentAndForecastWeatherData_throws(reqParamLocationId));
      await updateTimezoneInLocation(data.timezone_offset, reqParamLocationId);
      timezone = await getLocationTimezone(reqParamLocationId);
    }
    const today = getDateString(nowUnix, timezone);

    let paramsCurrent = [reqParamLocationId];
    let paramsDay = [reqParamLocationId, today];
    let paramsTime = [];

    let rowCurrent = await getRowCurrent(paramsCurrent);

    if (!rowCurrent) {
      data =
        data ||
        (await apiCallCurrentAndForecastWeatherData_throws(reqParamLocationId));
      await insertAllPresentFuture(data, paramsDay);
      rowCurrent = await getRowCurrent_throws(paramsCurrent);
    } else if (!(await openWeather.isUpdated(reqParamLocationId))) {
      data =
        data ||
        (await apiCallCurrentAndForecastWeatherData_throws(reqParamLocationId));
      await updateAllPresentFuture(data, paramsDay);
      rowCurrent = await getRowCurrent_throws(paramsCurrent);
    }

    let rowsDay = await getRowsDay_throws(paramsDay);
    paramsTime = [rowsDay[0].pk_weather_data_day_id];
    let rowsTime = await getRowsTime_throws(paramsTime);

    const builtResponse = {
      current_locale_time: getTimeString(nowUnix, timezone),
      rows: {
        current: rowCurrent,
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

    let row = await database.get_throws(
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
