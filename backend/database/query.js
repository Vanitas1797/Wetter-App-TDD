const database = require('../generate/objects/database/database');
const { tables } = require('../generate/objects/database/database');

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

// const functionParams = {
//   select:
//     {select:string[][]|'*',from:function[],join:{table:function,on:{left:string,right:string}}[],where},
// };
const arrays = {
  selectArray: [],
  fromTables: [],
  joinTables: [],
  whereArray: [],
};

module.exports = {
  /**
   *
   * @param {{select:string[][]|'*',from:function[],join:{table:function,on:{left:string,right:string}}[],where:{op:database['operators']['logicalOperators'],query:{field:function,op:database['operators']['comparisonOperators']}}[]}} query
   */
  select(query) {
    let string = `SELECT ${
      query.select == '*' ? '*' : select(query)
    }\nFROM ${from(query.from)}${query.join ? `\n${join(query.join)}` : ''}${
      query.where ? `\nWHERE ${where(query)}` : ''
    }`;
  },
};

/**
 *
 * @param {{select:string[][]|'*',from:function[],join:{table:function,on:{left:string,right:string}}[],where:{op:database['operators']['logicalOperators'],query:{field:function,op:database['operators']['comparisonOperators']}}[]}} whereQuery
 */
function where(whereQuery) {
  whereQuery.where.map((v) => {
    return `"${arrays.fromTables.includes()}"."${v.query.field.name}"`;
  });
}

/**
 *
 * @param {function[]} fromQuery
 */
function from(fromQuery) {
  return fromQuery
    .map((v) => {
      const table = `"${v.name}"`;
      arrays.fromTables.push(table);
      return table;
    })
    .join(', ');
}

/**
 *
 * @param {{table:function,on:{left:string,right:string}}[]} joinQuery
 */
function join(joinQuery) {
  return joinQuery
    .map((v) => {
      arrays.joinTables.push(v.table.name);
      return `JOIN "${v.table.name}" ON "${v.on.left}" = "${v.on.right}"`;
    })
    .join('\n');
}

/**
 *
 * @param {{select:string[][],from:function[],join:{table:function,on:{left:string,right:string}},where}} selectQuery
 */
function select(selectQuery) {
  let selects = [];
  selectQuery.select.forEach((v, i) => {
    v.forEach((v2) => {
      let table = selectQuery.from[i];
      if (!selectQuery.from[i]) {
        i = 0;
        table = selectQuery.join[i];
      }
      selects.push(`"${table}"."${v2}"`);
    });
  });
  return selects.join(', ');
}
