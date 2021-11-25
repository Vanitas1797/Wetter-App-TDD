const { normalFieldsObject } = require('../../objects/database/tables');
const error = require('../../errorHandling');

let validateErrors = {
  syntax: { message: 'Missing keys', errors: [] },
  type: { message: 'Wrong value types', errors: [] },
  value: { message: 'Wrong value validations', errors: [] },
};

/**
 *
 * @param {{request,check,key:string}} data
 */
function checkAll(data) {
  try {
    if (!hasType(data)) {
      validateValue(data);
    }
  } catch (error) {
    return;
  }
}

/**
 *
 * @param {{request:any[],check:any[],key:string}} data
 */
function iterateArray(data) {
  data.check.forEach((v, i) => {
    checkAll({
      request: data.request[i],
      check: v,
      key: data.key,
    });
  });
}

/**
 *
 * @param {{request:{},check:{}}} data
 */
function iterateObject(data) {
  for (const key in data.check) {
    if (!checkSyntax(data, key)) {
      continue;
    }
    const nextData = {
      request: data.request[key],
      check: data.check[key],
      key: key,
    };
    checkAll(nextData);
  }
}

function prepareErrors() {
  let err = [];
  let isError = false;
  for (const key in validateErrors) {
    if (validateErrors[key].errors.length) {
      isError = true;
      err.push(
        '\t' +
          error.buildError(
            validateErrors[key].errors,
            validateErrors[key].message
          )
      );
    }
  }
  if (isError) {
    throw new Error(err.join('\n'));
  }
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function checkSyntax(data, key) {
  if (typeof data.request[key] == 'undefined') {
    validateErrors.syntax.errors.push(key);
    return false;
  }
  return true;
}

/**
 *
 * @param {{request:{},check:normalFieldsObject['validation'],key:string}} data
 * @returns
 */
function validateValue(data) {
  if (data.check(data.request) == false) {
    validateErrors.value.errors.push(data.key);
    return false;
  }
  return true;
}

/**
 *
 * @param {{request,check,key:string}} data
 */
function hasType(data) {
  if (!isArray(data)) {
    if (!isObject(data)) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {{request,check,key:string}} data
 */
function isArray(data) {
  if (Array.isArray(data.check) && Array.isArray(data.request)) {
    iterateArray(data);
    return true;
  }
  if (!Array.isArray(data.check) && !Array.isArray(data.request)) {
    return false;
  }
  validateErrors.type.errors.push(data.key);
  throw 'err';
}

/**
 *
 * @param {{request,check,key:string}} data
 */
function isObject(data) {
  if (typeof data.check == 'object' && typeof data.request == 'object') {
    iterateObject(data);
    return true;
  }
  if (typeof data.check != 'object' && typeof data.request != 'object') {
    return false;
  }
  validateErrors.type.errors.push(data.key);
  throw 'err';
}

module.exports = {
  /**
   *
   * @param {{request:{params:{},query:{},body:{}},check:{params:{},query:{},body:{}}}} requestCheck
   */
  validateRequest(requestCheck) {
    if (requestCheck.check.params)
      iterateObject({
        ...requestCheck,
        request: requestCheck.request.params,
        check: requestCheck.check.params,
      });
    if (requestCheck.check.query)
      iterateObject({
        ...requestCheck,
        request: requestCheck.request.query,
        check: requestCheck.check.query,
      });
    if (requestCheck.check.body)
      iterateObject({
        ...requestCheck,
        request: requestCheck.request.body,
        check: requestCheck.check.body,
      });
    prepareErrors();
  },
};
