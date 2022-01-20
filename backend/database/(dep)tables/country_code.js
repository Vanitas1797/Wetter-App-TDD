const database = require('../database');

module.exports = {
  country_code: async function getCountryCodeId(country) {
    if (!country) country = 'null';
    let row = await database.get(database.queries.getCountry, [
      country,
      country,
      country,
    ]);

    return row.pk_country_code_id;
  },
};
