const { default: axios } = require('axios');

module.exports = {
  /**
   *
   * @param {string} url
   */
  async getDataFromApi(url) {
    const res = await axios.get(url);
    return res;
  },
  getLocaleTimeInMilliseconds(time, timezoneOffset) {
    return (time + timezoneOffset) * 1000;
  },
};
