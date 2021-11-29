module.exports = {
  /**
   *
   * @param {string} dateTimeString
   * @param {number} timezoneOffsetSeconds
   * @returns
   */
  getDate(dateTimeString, timezoneOffsetSeconds) {
    let dateStringArray = dateTimeString.split(', ');
    let date = dateTimeString.split('.');
    let time = dateTimeString.split(':');
    let newDate = '';

    if (!date.length) {
      throw new Error('There must be a date');
    }

    if (dateStringArray.length > 1) {
      date = dateStringArray[0].split('.');
      time = dateStringArray[1].split(':');
    }

    if (time.length <= 1) {
      newDate = `${date[2]}-${date[1]}-${date[0]}T00:00:00.000Z`;
    } else {
      newDate = `${date[2]}-${date[1]}-${date[0]}T${
        time[0] - timezoneOffsetSeconds / 3600
      }:${time[1]}:${time[2]}.000Z`;
    }

    return new Date(newDate);
  },
  /**
   *
   * @param {number} unix
   * @param {number} timezoneOffsetSeconds
   * @returns
   */
  getDateTimeString(unix, timezoneOffsetSeconds) {
    return (
      getDateString(unix, timezoneOffsetSeconds) +
      ', ' +
      getTimeString(unix, timezoneOffsetSeconds)
    );
  },
  getTimeString,
  getDateString,
};

/**
 *
 * @param {number} unix
 * @param {number} timezoneOffsetSeconds
 * @returns
 */
function getTimeString(unix, timezoneOffsetSeconds) {
  let date = getLocalDate(unix, timezoneOffsetSeconds);

  let hour = extendNumberWithZero(date.getUTCHours());
  let minute = extendNumberWithZero(date.getUTCMinutes());
  let second = extendNumberWithZero(date.getUTCSeconds());

  let newTimeString = `${hour}:${minute}:${second}`;

  return newTimeString;
}

/**
 *
 * @param {number} unix
 * @param {number} timezoneOffsetSeconds
 * @returns
 */
function getDateString(unix, timezoneOffsetSeconds) {
  let date = getLocalDate(unix, timezoneOffsetSeconds);

  let day = extendNumberWithZero(date.getUTCDate());
  let month = extendNumberWithZero(date.getUTCMonth() + 1);
  let year = date.getUTCFullYear();

  let newDateString = `${day}.${month}.${year}`;

  return newDateString;
}

/**
 *
 * @param {number} unix
 * @param {number} timezoneOffsetSeconds
 * @returns
 */
function getLocalDate(unix, timezoneOffsetSeconds) {
  unix = getUnixInMilliseconds(unix);

  timezoneOffsetSeconds = timezoneOffsetSeconds || 0;
  let localTime = getLocaleTime(unix, timezoneOffsetSeconds);

  let date = new Date(localTime);

  return date;
}

function getLocaleTime(unix, timezoneOffsetSeconds) {
  return (unix / 1000 + timezoneOffsetSeconds) * 1000;
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
 * @returns
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
