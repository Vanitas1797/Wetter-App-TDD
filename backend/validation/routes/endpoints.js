const {
  tables,
  normalFieldsObject,
} = require('../../generate/objects/database/tables');
const { buildError, listErrorResultsWithMessage } = require('../error');

let validateErrors = {
  syntaxes: { message: '', errors: [] },
  types: { message: '', errors: [] },
  values: { message: '', errors: [] },
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

/**
 *
 */
function prepareErrors() {
  for (const key in validateErrors) {
    buildError(validateErrors[key].errors, validateErrors[key].message);
  }
  let errorMessageSyntax = listErrorResultsWithMessage(
    'Keys are wrong',
    validateErrors.syntaxes
  );
  let errorMessageTypes = listErrorResultsWithMessage(
    'Value types are wrong',
    validateErrors.types
  );
  let errorMessageValues = listErrorResultsWithMessage(
    'Value validations are wrong',
    validateErrors.values
  );
  let compareRequestAndCheckMessage = `Wrong object:\n${object}\nRight object:\n${check}`;

  buildError();
}

/**
 *
 * @param {{request:{},check:{},key:string}} data
 */
function checkRequestData(data) {
  if (syntax(data.request[data.key])) {
    validateErrors.syntaxes.errors.push(key);
    return false;
  } else if (type(data)) {
    validateErrors.types.errors.push(key);
    return false;
  } else if (value(data)) {
    validateErrors.values.errors.push(key);
    return false;
  }
  return true;
}

/**
 *
 * @param {{}} request
 * @returns
 */
function syntax(request) {
  return !request;
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
  return requestCheck.check.validation(requestCheck.request);
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
