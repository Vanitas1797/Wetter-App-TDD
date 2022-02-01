const database = require('../database');

module.exports = {
  country_code: async function getCountryCodeId(country) {
    if (!country) country = 'null';
    let row = await database.get(database.queries.getCountry, [
      country,
      country,
      country,
    ]);
    if (!row)
      row = await database.get(database.queries.getCountry, [
        'null',
        'null',
        'null',
      ]);

    return row ? row.pk_country_code_id : null;
  },
};
