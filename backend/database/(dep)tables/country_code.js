const database = require('../database');

module.exports = {
  country_code: async function getCountryCodeId(code) {
    if (!code) return null;
    let row = await database.get(database.queries.getCountryCode, code);

    return row.pk_country_code_id;
  },
};
