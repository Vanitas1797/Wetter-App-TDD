const { getLocaleTimeInMilliseconds } = require('../api/openWeather');

module.exports = {
  getDateFromDateString(dateString) {
    let dateStringArray = dateString.split(', ');

    let date = dateStringArray[0].split('.');
    let time = dateStringArray[1].split(':');

    let newDate = `${date[2]}-${date[1]}-${date[0]}T${time[0]}:${time[1]}:${time[2]}.000Z`;

    return newDate;
  },
  getDateStringFromSeconds(time, timezoneOffset) {
    let localTime = getLocaleTimeInMilliseconds(time, timezoneOffset);

    let dateString = new Date(localTime).toString();

    let dateTimeArray = dateString.split('T');

    let dateArray = dateTimeArray[0].split('-');
    let timeArray = dateTimeArray[1].split(':');
    timeArray[2] = timeArray[2].slice(0, 2);

    let newDateString = `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}, ${timeArray[0]}:${timeArray[1]}:${timeArray[2]}`;

    return newDateString;
  },
};

// 24.11.2021, 18:48:42
// new Date() = 2021-11-24T17:48:42.435Z
