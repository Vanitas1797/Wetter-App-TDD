const database = require('../database');

function getWindDirection(windDegree) {
  let deg = Math.floor(windDegree / 45) * 45;
  return database.get(database.queries.getWindDirection, deg);
}

module.exports = { getWindDirection };
