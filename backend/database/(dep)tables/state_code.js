const database = require('../database');

module.exports = {
  state_code: async function getStateCodeId(state) {
    if (!state) state = 'null';
    let row = await database.get(database.queries.getStateCode, [state, state]);
    if (!row)
      row = await database.get(database.queries.getStateCode, ['null', 'null']);

    return row ? row.pk_state_code_id : null;
  },
};
