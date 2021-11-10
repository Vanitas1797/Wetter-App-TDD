const database = require('../database');

function getLocation(latitude, longitude) {
  return database.get(database.queries.getLocationId, latitude, longitude);
}

module.exports = { getLocation };
