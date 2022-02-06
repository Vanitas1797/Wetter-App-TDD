const database = require('../database');

module.exports = {
  state_code: async function getStateCodeId(state) {
    let row = await database.get(database.queries.getStateCode, [state, state]);
    if (!row) {
      return 57
    }

    return row ? row.pk_state_code_id : null;
  },
};
