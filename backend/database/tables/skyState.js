const database = require('../database');

async function getSkyState(skyState) {
  let row = await database.get(database.queries.getSkyState, skyState);
  if (!row) {
    await database.run(database.queries.insertSkyState, skyState);
    row = await database.get(database.queries.getSkyState, skyState);
  }
  return row;
}

module.exports = { getSkyState };
