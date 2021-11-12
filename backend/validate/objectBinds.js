const objectBinds = require('../generate/objectBinds');

let newObjectBinds = objectBinds;
module.exports = {
  /**
   *
   * @param {{}} object
   */
  isObjectInBinds: function (object) {
    for (let objectKey in object) {
      for (let newObjectBindsKey in newObjectBinds) {
        if (!newObjectBinds[objectKey]) {
          newObjectBinds = newObjectBinds[newObjectBindsKey];
        }
      }
    }
  },
};
