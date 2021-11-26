const { getLocaleTimeInMilliseconds: getLocaleTime } = require('../../api/openWeather');

module.exports = {
  time: function getLocaleStringFromMilliseconds(time, timezoneOffset) {
    let localTime = getLocaleTime(time, timezoneOffset);
    return new Date(localTime * 1000).toLocaleTimeString();
  },
  getMillisecondsFromLocaleString(date) {},
};