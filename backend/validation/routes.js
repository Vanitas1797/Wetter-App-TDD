const createError = require('http-errors');

function validateParamsOrQuery(values, object) {
  let errorMessages = [];
  let error = null;
  for (const key of values) {
    if (typeof object[key] === 'undefined') {
      error = error || 'Keys are wrong or missing: ';
      errorMessages.push(key);
    }
  }
  if (error) {
    throw (error = createError.BadRequest(error + errorMessages.join(', ')));
  }
}

module.exports = { validateParamsOrQuery };
