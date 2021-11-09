const fs = require('fs');

const generate = {
  newJsonObject: {},
  buildJsonObject(object, newJsonObject) {
    for (let key in object) {
      if (Array.isArray(object[key])) {
        newJsonObject[key] = { [key]: key };
        newJsonObject[key][0] = {};
        this.buildJsonObject(object[key][0], newJsonObject[key][0]);
      } else if (typeof object[key] == 'object') {
        newJsonObject[key] = { [key]: key };
        this.buildJsonObject(object[key], newJsonObject[key]);
      } else {
        newJsonObject[key] = key;
      }
    }
    return newJsonObject;
  },
  createFile(file) {
    const object = require(`../objects/raw/${file}`);
    let path = 'backend/objects/mapped/' + file;
    this.buildJsonObject(object, this.newJsonObject);
    fs.writeFileSync(path, JSON.stringify(this.newJsonObject));
  },
};

module.exports = { generate };
