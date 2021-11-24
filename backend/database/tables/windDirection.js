const database = require('../database');

module.exports = {
  wind_direction: async function getWindDirectionName(windDegree) {
    let deg = Math.floor(windDegree / 45) * 45;
    let row = await database.get(database.queries.getWindDirection, deg);
    return row.wind_direction_name;
  },
};
