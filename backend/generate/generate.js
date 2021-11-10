const fs = require('fs');
const path = require('path');

function createFile(file) {
  const object = require(`./objects/raw/${file}`);
  let path = './backend/generate/objects/mapped/' + file;
  let newJsonObject = {};
  buildJsonObject(object, newJsonObject);
  fs.writeFileSync(path, JSON.stringify(newJsonObject));
}

function updateJsonFile(filePath, object) {
  let string = JSON.stringify(object);
  fs.writeFileSync(filePath, string);
}

function buildJsonObject(object, newJsonObject) {
  for (let key in object) {
    if (Array.isArray(object[key])) {
      newJsonObject[key] = { [key]: key };
      newJsonObject[key][0] = {};
      buildJsonObject(object[key][0], newJsonObject[key][0]);
    } else if (typeof object[key] == 'object') {
      newJsonObject[key] = { [key]: key };
      buildJsonObject(object[key], newJsonObject[key]);
    } else {
      newJsonObject[key] = key;
    }
  }
  return newJsonObject;
}

module.exports = { updateJsonFile };
