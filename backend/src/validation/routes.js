const createError = require('http-errors');

function validateParamsOrQuery(values, object) {
  let err;
  for (const key of values) {
    if (!object[key]) {
      err = err || new Error();
      err.message = err.message || 'Keys are wrong or missing: ';
      err.message += key + ', ';
    }
  }
  if (err) {
    err.message = err.message.slice(0, err.message.length - 2);
    err = createError.BadRequest(err);
  }
  return err;
}

module.exports = { validateParamsOrQuery };
