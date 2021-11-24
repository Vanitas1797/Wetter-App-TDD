const database = require('../database');

async function getSkyStateName(skyState) {
  let row = await database.get(database.queries.getSkyState, skyState);
  if (!row) {
    await database.run(database.queries.insertSkyState, skyState);
    row = await database.get(database.queries.getSkyState, skyState);
  }
  return row.pk_sky_state_name;
}

module.exports = { getSkyStateName };
