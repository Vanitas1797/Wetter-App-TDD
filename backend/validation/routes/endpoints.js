const {
  tables,
  normalFieldsObject,
} = require('../../generate/objects/database/tables');
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
      checkRequestDataTypes(data);
    }
  }
}

/**
 *
 * @param {{request:{},check:{}}} data
 */
function checkRequestDataTypes(data) {
  for (const key in data.check) {
    const checkData = { request: data.request, check: data.check, key: key };
    if (!checkRequestData(checkData)) continue;
    const nextData = { request: data.request[key], check: data.check[key] };
    if (Array.isArray(nextData.check)) {
      iterateArray(nextData);
    } else if (typeof nextData.check == 'object') {
      iterateObject(nextData);
    }
  }
}

/**
 *
 * @param {any[]} data
 */
function iterateArray(data) {
  data.forEach((v) => {
    checkRequestDataTypes(v);
  });
}

/**
 *
 * @param {{}} data
 */
function iterateObject(data) {
  for (const key in data) {
    checkRequestDataTypes(data[key]);
  }
}

function prepareErrors() {
  let err = [];
  for (const key in validateErrors) {
    err.push(
      '\t' +
        error.buildError(
          validateErrors[key].errors,
          validateErrors[key].message
        )
    );
  }
  if (err.length) {
    throw new Error(err.join('\n'));
  }
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 */
function checkRequestData(data) {
  if (syntax(data)) {
    validateErrors.syntax.errors.push(data.key);
    return false;
  } else if (type(data)) {
    validateErrors.type.errors.push(data.key);
    return false;
  } else if (value(data)) {
    validateErrors.value.errors.push(data.key);
    return false;
  }
  return true;
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function syntax(data) {
  return typeof data.request[data.key] == 'undefined';
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 * @returns
 */
function type(data) {
  return typeof data.check[data.key] != typeof data.request[data.key];
}

/**
 *
 * @param {{request:{},check:{},key:string}} requestCheck
 * @returns
 */
function value(requestCheck) {
  return;
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
