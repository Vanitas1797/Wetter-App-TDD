const { getKeyNamesOfObject } = require('../help/objects');
const { checkObjects, checkInnerObject } = require('../validation/objects');
const tables = require('./tables.json');

const query = {
  queryString: '',
  UPDATE,
  DELETE,
  DROP() {},
  CREATE() {},
  INSERT() {},
};

let currentTable = {};

function UPDATE(table) {
  let keys = Object.keys(table);
  if (keys.length > 1) {
    throw new Error(`Too many tables. Only 1 is allowed`);
  }
  if (!tables[keys]) {
    throw new Error(`Table '${keys[0]}' does not exist`);
  }
  currentTable = table;
  query.queryString = `UPDATE ${tableName}\n`;
  return { SET };
}

function SET(columnsAndValues) {
  let wrongFields = checkObjects(currentTable, columnsAndValues);
  if (wrongFields) {
    throw new Error(`These Keys are wrong:\n${wrongFields}`);
  }
  query.queryString += `SET `;
  let buildSet = [];
  for (let columnName in columnsAndValues) {
    buildSet.push(`${columnName} = ${columnsAndValues[columnName]}`);
  }
  query.queryString += buildSet.join(', ') + '\n';
  return { WHERE };
}

function WHERE(columnsAndValues) {}

function DELETE(tableName) {
  query.queryString = `DELETE FROM ${tableName}\n`;
}

module.exports = query;
