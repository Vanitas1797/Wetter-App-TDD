const { getLocaleTimeInMilliseconds } = require('../api/openWeather');

module.exports = {
  getDateFromDateString(dateString) {
    let dateStringArray = dateString.split(', ');

    let date = dateStringArray[0].split('.');
    let time = dateStringArray[1].split(':');

    let newDate = `${date[2]}-${date[1]}-${date[0]}T${time[0]}:${time[1]}:${time[2]}.000Z`;

    return newDate;
  },
  getDateTimeStringFromSeconds(time, timezoneOffset) {
    return (
      this.getDateFromDateString() + ', ' + this.getTimeStringFromSeconds()
    );
  },
  getDateStringFromSeconds(time, timezoneOffset) {
    let localTime = getLocaleTimeInMilliseconds(time, timezoneOffset);

    let date = new Date(localTime);

    let day = extendNumberWithZero(date.getUTCDate());
    let month = extendNumberWithZero(date.getUTCMonth() + 1);
    let year = date.getUTCFullYear();

    let newDateString = `${day}.${month}.${year}`;

    return newDateString;
  },
  getTimeStringFromSeconds(time, timezoneOffset) {
    let localTime = getLocaleTimeInMilliseconds(time, timezoneOffset);

    let date = new Date(localTime);

    let hour = extendNumberWithZero(date.getUTCHours());
    let minute = extendNumberWithZero(date.getUTCMinutes());
    let second = extendNumberWithZero(date.getUTCSeconds());

    let newTimeString = `${hour}:${minute}:${second}`;

    return newTimeString;
  },
};

/**
 *
 * @param {number} params
 * @returns
 */
function extendNumberWithZero(params) {
  if (params.toString().length == 1) return '0' + params.toString();
  return params;
}

// 24.11.2021, 18:48:42
// new Date() = 2021-11-24T17:48:42.435Z
