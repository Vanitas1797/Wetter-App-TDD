const { getLocaleTimeInMilliseconds: getLocaleTime } = require('../../api/openWeather');

module.exports = {
  sunset: function getTimeFromMilliseconds(time, timezoneOffset) {
    let localTime = getLocaleTime(time, timezoneOffset);
    return new Date(localTime * 1000).toLocaleTimeString();
  },
};
