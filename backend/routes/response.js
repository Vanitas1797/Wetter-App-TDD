const { tables } = require('../generate/objects/database/database');

module.exports = {
  /**
   *
   * @param {{option:'database',datas:{}[],check:{}}} responseCheck
   */
  buildResponse(responseCheck) {
    if (responseCheck.option == 'database') return database(responseCheck);
  },
};

let response = {};

/**
 *
 * @param {{rows:{}[],check:{}}} responseCheck
 */
function database(responseCheck) {
  for (const key in responseCheck.check) {
    for (const row of responseCheck.rows) {
      for (const key2 in tables) {
        for (const key3 in tables[key2]()) {
          if (tables[key2]()[key3]().json == key) {
            response[key] = row[tables[key2]()[key3].name];
          }
        }
      }
    }
  }
  return response;
}
