const database = require('../database');

module.exports = {
  country_code: async function getCountryCodeId(country) {
    let row = await database.get(database.queries.getCountry, [
      country,
      country,
      country,
    ]);
    if (!row) return 241;

    return row ? row.pk_country_code_id : null;
  },
};
