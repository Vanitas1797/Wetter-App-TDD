const { default: axios } = require('axios');

module.exports = {
  async callApiGet(url) {
    let response = await axios.get(url);
  },
};
