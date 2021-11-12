const objectBinds = require('../generate/objectBinds');
let tables = objectBinds.database.tables;

const query = {
  SELECT_FROM: SELECT_FROM,
  UPDATE_SET: UPDATE_SET,
  DELETE_FROM: DELETE_FROM,
};

const where = {
  SELECT_FROM: SELECT_FROM,
};

let queryString = '';

/**
 *
 * @param {tables} table
 */
function UPDATE_SET(table) {
  let tableName = getObjectNames(table);
  queryString = `UPDATE ${tableName}\n`;
  SET(table[tableName]);
  return { queryString, WHERE };
}

function SET(fields) {
  queryString += `SET `;
  let buildSet = [];
  for (let columnName in fields) {
    buildSet.push(`${columnName} = ${fields[columnName]}`);
  }
  queryString += buildSet.join(', ') + '\n';
}

/**
 *
 * @param {tables} tables
 */
function WHERE(tables) {
  let tableNames = getObjectNames(tables);
  let fields = tables[tableNames];
  queryString += 'WHERE ';
  for (let fieldName of fields) {
    queryString += `${fieldName} ${fields[fieldName]}`;
  }
  return { queryString };
}

/**
 *
 * @param {tables} table
 */
function DELETE_FROM(table) {
  queryString = `DELETE `;
  let tableNames = getObjectNames(table);
  FROM(tableNames);
  return { queryString, WHERE };
}

/**
 *
 * @param {tables} tables
 */
function SELECT_FROM(tables) {
  queryString = `SELECT `;
  let tableNames = getObjectNames(tables);
  prepareFields(getFieldNames(tables), tableNames);
  FROM(tableNames);
  return { queryString, JOIN, WHERE };
}

function FROM(tableNames) {
  queryString += `FROM ${tableNames.join(', ')}`;
}

function AS(fieldNames) {
  let fieldNamesWithAs = [];
  for (let fieldname of fieldNames) {
    fieldNamesWithAs.push(`${fieldname} AS '${fieldname}'`);
  }
  return fieldNamesWithAs;
}

/**
 *
 * @param {tables} params
 * @returns
 */
function JOIN(params) {
  return { queryString, WHERE };
}

function modifyFieldNameWithTable(fieldNameArrays, tableNames) {
  let modifiedFieldNames = [];
  let i = 0;
  for (let fieldNames of fieldNameArrays) {
    for (let fieldName of fieldNames) {
      modifiedFieldNames.push(`${tableNames[i]}.${fieldName}`);
    }
    i++;
  }
  return modifiedFieldNames;
}

function prepareFields(fieldNameArrays, tableNames) {
  if (fieldNameArrays.length) {
    let modifiedFieldNames = modifyFieldNameWithTable(
      fieldNameArrays,
      tableNames
    );
    let fieldNamesWithAs = AS(modifiedFieldNames);
    queryString += fieldNamesWithAs.join(', ');
  } else {
    queryString += '*';
  }
  queryString += '\n';
}

function getObjectNames(object) {
  let objectNameArrays = Object.keys(object);
  return objectNameArrays;
}

function getFieldNames(tables) {
  let fieldNames = [];
  for (let tableName in tables) {
    let fields = tables[tableName];
    fieldNames.push(getObjectNames(fields));
  }
  return fieldNames;
}

module.exports = { query };
