module.exports = {
  /**
   *
   * @param {{request,check}} requestCheck
   */
  validateRequest_throws(requestCheck) {
    const rParams = requestCheck.request.params;
    const rQuery = requestCheck.request.query;
    const rBody = requestCheck.request.body;
    const cParams = requestCheck.check.params;
    const cQuery = requestCheck.check.query;
    const cBody = requestCheck.check.body;
    const cValidationParams = requestCheck.check.validation.params;
    const cValidationQuery = requestCheck.check.validation.query;
    const cValidationBody = requestCheck.check.validation.body;
    checkType({
      request: { params: rParams, query: rQuery, body: rBody },
      check: { params: cParams, query: cQuery, body: cBody },
    });
    checkValue({
      request: { params: rParams, query: rQuery, body: rBody },
      check: {
        params: cValidationParams,
        query: cValidationQuery,
        body: cValidationBody,
      },
    });
    prepareErrors_throws();
  },
};

class ValidateErrors {
  constructor() {
    return {
      syntax: {
        message: 'Keys are missing',
        errors: [],
      },
      type: {
        message: 'Value types are wrong',
        errors: [],
      },
      value: {
        message: 'Value validations are wrong',
        errors: [],
      },
    };
  }
}

let validateErrors = new ValidateErrors();

function prepareErrors_throws() {
  let errors = [];
  for (const key in validateErrors) {
    if (validateErrors[key].errors.length) {
      errors.push(
        validateErrors[key].message +
          ': ' +
          validateErrors[key].errors.join(', ')
      );
    }
  }
  validateErrors = new ValidateErrors();
  if (errors.length) {
    throw new Error(errors.join('\n'));
  }
}

function checkAll(data) {
  const type = checkType(data);
  if (type == false) {
    validateErrors.type.errors.push(data.cKey);
  }
}

function checkType(data) {
  const type = isArray(data) || isObject(data);
  if (type == false) {
    validateErrors.type.errors.push(data.cKey);
  }
}

function isObject(data) {
  if (typeof data.check == 'object' && typeof data.request == 'object') {
    iterateObject(data);
    return 'object';
  } else if (typeof data.check == 'object' && typeof data.request != 'object') {
    return false;
  }
}

function isArray(data) {
  if (Array.isArray(data.check) && Array.isArray(data.request)) {
    iterateArray(data);
    return 'array';
  } else if (Array.isArray(data.check) && !Array.isArray(data.request)) {
    return false;
  }
}

function isFunction(data) {
  if (typeof data.check == 'function') {
    return 'function';
  }
  return true;
}

function iterateArray(data) {
  data.check.forEach((v, i) => {
    checkType({ request: data.request[i], check: v });
  });
}

function iterateObject(data) {
  let i = 0;
  let requestKeys = Object.keys(data.request);
  for (const cKey in data.check) {
    if (checkSyntax(cKey, requestKeys[i]) == true) {
      const newData = {
        request: data.request[cKey],
        check: data.check[cKey],
        cKey: cKey,
        rKey: requestKeys[i],
      };

      checkType(newData);
    }
    i++;
  }
}

function checkSyntax(cKey, rKey) {
  if (cKey != rKey) {
    validateErrors.syntax.errors.push(cKey);
    return false;
  }
  return true;
}

function checkValue(data) {
  for (const key in data.check) {
    if (data.check[key]) {
      let cKeys = Object.keys(data.check[key]);
      cKeys.forEach((v) => {
        try {
          let r = data.request[key][v];
          if (key == v) {
            r = data.request[key];
          }
          data.check[key][v](r);
        } catch (error) {
          validateErrors.value.errors.push(v + ': ' + error);
        }
      });
    }
  }
}
