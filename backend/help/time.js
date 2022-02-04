const units = { ms: 0, s: 0, mi: 0, h: 0, d: 0, w: 0, mo: 0, y: 0 };

module.exports = {
  /**
   *
   * @param {units} units
   * @returns
   */
  toMilliseconds(units) {
    return this.toSeconds(units) * 1000;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toSeconds(units) {
    return this.toMinutes(units) * 60;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toMinutes(units) {
    return this.toHours(units) * 60;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toHours(units) {
    return this.toDays(units) * 24;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toDays(units) {
    let days = getDaysFromUnits(units);
    return days;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toWeeks(units) {
    return this.toDays(units) / 7;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toMonths(units) {
    return this.toYears(units) * 12;
  },
  /**
   *
   * @param {units} units
   * @returns
   */
  toYears(units) {
    return this.toSeconds(units) / 31556926;
  },
  /**
   *
   * @param {number} weekday
   */
  getWeekDay(weekday) {
    switch (weekday) {
      case 0:
        return 'Sonntag';
      case 1:
        return 'Montag';
      case 2:
        return 'Dienstag';
      case 3:
        return 'Mittwoch';
      case 4:
        return 'Donnerstag';
      case 5:
        return 'Freitag';
      case 6:
        return 'Samstag';
    }
  },
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
    timezoneOffsetSeconds = timezoneOffsetSeconds || 0;

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
 * @param {units} units
 */
function getDaysFromUnits(units) {
  let ms = (u) => s(u) / 1000;
  let s = (u) => mi(u) / 60;
  let mi = (u) => h(u) / 60;
  let h = (u) => u / 24;
  let d = (u) => u;
  let w = (u) => u * 7;
  let mo = (u) => y(u) / 12;
  let y = (u) => s(u) * 31556926;

  return (
    ms(units.ms) ||
    0 + s(units.s) ||
    0 + mi(units.mi) ||
    0 + h(units.h) ||
    0 + d(units.d) ||
    0 + w(units.w) ||
    0 + mo(units.mo) ||
    0 + y(units.y) ||
    0
  );
}

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
