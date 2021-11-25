const { getLocaleTime: getLocaleTime } = require('../api/openWeather');

module.exports = {
  /**
   *
   * @param {string} dateTimeString
   * @returns
   */
  getDate(dateTimeString) {
    let dateStringArray = dateTimeString.split(', ');
    let date = dateTimeString.split('.');
    let time = dateTimeString.split(':');
    let newDate = '';

    if (!date.length) {
      throw new Error('There must be a date');
    }

    if (dateStringArray.length) {
      date = dateStringArray[0].split('.');
      time = dateStringArray[1].split(':');
    }

    if (!time.length) {
      newDate = `${date[2]}-${date[1]}-${date[0]}T00:00:00.000Z`;
    } else {
      newDate = `${date[2]}-${date[1]}-${date[0]}T${time[0]}:${time[1]}:${time[2]}.000Z`;
    }

    return new Date(newDate);
  },
  /**
   *
   * @param {number} unix
   * @param {number} timezoneOffsetSeconds
   * @returns
   */ getDateTimeString(unix, timezoneOffsetSeconds) {
    return (
      this.getDateString(unix, timezoneOffsetSeconds) +
      ', ' +
      this.getTimeString(unix, timezoneOffsetSeconds)
    );
  },
  /**
   *
   * @param {number} unix
   * @param {number} timezoneOffsetSeconds
   * @returns
   */ getTimeString(unix, timezoneOffsetSeconds) {
    let date = getLocalDate(unix, timezoneOffsetSeconds);

    let hour = extendNumberWithZero(date.getUTCHours());
    let minute = extendNumberWithZero(date.getUTCMinutes());
    let second = extendNumberWithZero(date.getUTCSeconds());

    let newTimeString = `${hour}:${minute}:${second}`;

    return newTimeString;
  },
  /**
   *
   * @param {number} unix
   * @param {number} timezoneOffsetSeconds
   * @returns
   */
  getDateString(unix, timezoneOffsetSeconds) {
    let date = getLocalDate(unix, timezoneOffsetSeconds);

    let day = extendNumberWithZero(date.getUTCDate());
    let month = extendNumberWithZero(date.getUTCMonth() + 1);
    let year = date.getUTCFullYear();

    let newDateString = `${day}.${month}.${year}`;

    return newDateString;
  },
};

/**
 *
 * @param {number} unix
 * @param {*} timezoneOffsetSeconds
 * @returns
 */
function getLocalDate(unix, timezoneOffsetSeconds) {
  unix = getUnixInMilliseconds(unix);

  let localTime = getLocaleTime(unix, timezoneOffsetSeconds);

  let date = new Date(localTime);

  return date;
}

/**
 *
 * @param {number} params
 * @returns
 */
function extendNumberWithZero(params) {
  if (params.toString().length == 1) return '0' + params.toString();
  return params;
}

/**
 *
 * @param {number} unix
 */
function getUnixInMilliseconds(unix) {
  let nowUnixLength = new Date().getTime().toString().length;
  let unixString = unix.toString().split('.')[0];
  let diffLength = nowUnixLength - unixString.length;
  if (diffLength > 0) {
    for (; unixString.length < nowUnixLength; ) {
      unixString += '0';
    }
  } else if (diffLength < 0) {
    unixString = unixString.slice(0, unixString.length - diffLength);
  }
  return parseInt(unixString);
}

// 24.11.2021, 18:48:42
// new Date() = 2021-11-24T17:48:42.435Z
