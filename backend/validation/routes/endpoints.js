const error = require('../error');

let validateErrors = {
  syntax: { message: 'Missing keys', errors: [] },
  type: { message: 'Wrong value types', errors: [] },
  value: { message: 'Wrong value validations', errors: [] },
};

/**
 *
 * @param {{request:{params:{},query:{},body:{}},check:{params:{},query:{},body:{}}}} requestCheck
 */
function iterateRequestData(requestCheck) {
  for (const key in requestCheck.check) {
    if (requestCheck.request[key]) {
      const data = {
        request: requestCheck.request[key],
        check: requestCheck.check[key],
      };
      checkAll(data);
    }
  }
}

/**
 *
 * @param {{request:{},check:{}}} data
 */
function checkAll(data) {
  for (const key in data.check) {
    const checkData = { ...data, key: key };
    if (!checkSyntax(checkData)) {
      validateErrors.syntax.errors.push(key);
      continue;
    }
    const nextData = {
      request: data.request[key],
      check: data.check[key],
      key: key,
    };
    checkTypeAndValidation(nextData);
  }
}

/**
 *
 * @param {{request:[],check:[],key:string}} data
 */
function iterateArray(data) {
  data.check.forEach((v, i) => {
    const nextData = { request: data.request[i], check: v };
    checkAll(nextData);
  });
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
function checkSyntax(data) {
  return typeof data.request[data.key] != 'undefined';
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function checkTypeAndValidation(data) {
  if (checkType(data)) checkValidation(data);
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function checkValidation(data) {
  if (!data.check(data.request)) {
    validateErrors.value.errors.push(data.key);
  }
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function checkType(data) {
  if (Array.isArray(data.check)) {
    if (!Array.isArray(data.request)) {
      validateErrors.type.errors.push(data.key);
    }
    return iterateArray(data);
  } else if (typeof data.check == 'object') {
    if (typeof data.request != 'object') {
      validateErrors.type.errors.push(data.key);
    }
    return checkAll(data);
  }
  return true;
}

module.exports = {
  /**
   *
   * @param {{request:{params:{},query:{},body:{}},check:{params:{},query:{},body:{}}}} requestCheck
   */
  validateRequest(requestCheck) {
    iterateRequestData(requestCheck);
    prepareErrors();
  },
};
