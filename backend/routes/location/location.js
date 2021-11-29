// todo: errors: queries:
// SQLITE_ERROR: no such column: temperature
// getWeatherDataDaysForecast() fehlerhaft datumausgabe
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
const timezoneDE = time.timezoneOffsetSeconds().de;

/**
 *
 * @param {[]} paramsDay
 * @returns
 */
async function getWeatherDataDaysForecast(paramsDay, timezone_offset) {
  const rowsDay = [];
  const now = new Date();
  for (let i = 0; i < openWeatherApi.execution.forecast.days; i++) {
    const rowDay = await database.get_throws404(
      database.queries.getWeatherDataDay,
      paramsDay
    );
    if (rowDay) rowsDay.push(rowDay);
    let dayString = getDateString(
      new Date(now.setDate(now.getDate() + 1)).getTime(),
      timezone_offset
    );
    paramsDay[1] = dayString;
  }
  paramsDay[1] = getDateString(new Date().getTime(), timezone_offset);

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
  await database.run_throws400(
    database.queries.insertWeatherDataCurrent,
    insertCurrent
  );
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
    await database.run_throws400(
      database.queries.insertWeatherDataDay,
      insertDaily
    );
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 * @param {{}[]} rowsDay
 */
async function insertRowsTime(data, paramsDay, timezone_offset) {
  let rowsDay = await getRowsDay_throws(paramsDay, timezone_offset);

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
    await database.run_throws400(
      database.queries.insertWeatherDataTime,
      insertHourly
    );
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 */
async function updateRowCurrent(data) {
  let updateCurrent = [
    getDateTimeString(new Date().getTime(), timezoneDE),
    data.locationId,
  ];
  await database.run_throws400(
    database.queries.updateWeatherDataCurrent,
    updateCurrent
  );
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
    await database.run_throws400(
      database.queries.updateWeatherDataDay,
      updateDaily
    );
  }
}

/**
 *
 * @param {currentAndForecastWeatherData} data
 * @param {{}[]} rowsDay
 */
async function updateRowsTime(data, paramsDay, timezone_offset) {
  let rowsDay = await getRowsDay_throws(paramsDay, timezone_offset);

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
    await database.run_throws400(
      database.queries.updateWeatherDataTime,
      updateHourly
    );
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
  let rowCurrent = await database.get_throws404(
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
  let row = await database.get_throws404(
    `SELECT *
  FROM location
  WHERE pk_location_id = ?`,
    locationId
  );
  return row.timezone_offset;
}

async function insertAllPresentFuture(data, paramsDay) {
  await insertRowCurrent(data);
  await insertRowsDay(data);
  await insertRowsTime(data, paramsDay);
}

async function getRowsDay_throws(paramsDay, timezone_offset) {
  let rowsDay = await getWeatherDataDaysForecast(paramsDay, timezone_offset);
  if (!rowsDay) throw new Error('Rows day is empty');
  return rowsDay;
}

async function getRowsTime_throws(paramsTime) {
  let rowsTime = await database.all_throws404(
    database.queries.getWeatherDataTime,
    paramsTime
  );
  return rowsTime;
}

async function apiCallCurrentAndForecastWeatherData_throws(reqParamLocationId) {
  let rowLocation = await database.get_throws404(
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
  await database.run_throws400(database.queries.insertLocation, insert);
}

async function insertByCoordinatesByZipOrPostCode(data) {
  let insert = [
    data.name,
    await state_code(data.state),
    await country_code(data.country),
    data.zip,
    data.lat,
    data.lon,
    null,
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
      null,
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
      null,
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
  await database.run_throws400(
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
  await database.run_throws400(
    `UPDATE ${tables.location.name}
    SET ${tables.location().timezone_offset.name} = ${timezone}
    WHERE ${tables.location().pk_location_id.name} = ${locationId}`
  );
}

// /location
router.get('/', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest_throws({
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
      timezone_offset: '',
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
    validation.endpoints.validateRequest_throws({
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
    const today = getDateString(new Date().getTime(), timezone);

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

    let rowsDay = await getRowsDay_throws(paramsDay, timezone);
    paramsTime = [rowsDay[0].pk_weather_data_day_id];
    let rowsTime = await getRowsTime_throws(paramsTime);

    const builtResponse = {
      current_locale_time: getTimeString(new Date().getTime(), timezone),
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
    validation.endpoints.validateRequest_throws({
      request: req,
      check: dataTemplate.past.get.request,
    });

    const paramsDay = [req.params.location_id, req.body.date_in_past.date];

    let rowDay = await database.get_throws404(
      database.queries2.getWeatherDataDayByLocationIdAndDate,
      paramsDay
    );
    const paramsTime = [rowDay.pk_weather_data_day_id];
    let rowsTime = await database.all_throws404(
      database.queries2.getWeatherDataTimeByWeatherDataDayId,
      paramsTime
    );

    const builtResponse = {
      rows: {
        day: rowDay,
        hours: rowsTime,
      },
    };

    res.json(builtResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
