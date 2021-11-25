const database = require('../database');

module.exports = {
  state_code: async function getStateCodeId(code) {
    if (!code) return null;
    let row = await database.get(database.queries.getStateCode, code);

    return row.pk_state_code_id;
  },
};
