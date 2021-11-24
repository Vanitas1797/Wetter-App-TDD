function checkObjects(rObject, wObject) {
  let fails = [];
  for (let key in wObject) {
    if (!rObject[key]) {
      fails.push(key);
    }
  }
  if (fails.length) {
    let wrongKeys = fails.join(', ');
    return wrongKeys;
  }
}

function checkInnerObject(rObject, wObject) {
  for (let key in rObject) {
    if (rObject[key] == wObject) {
      return key;
    }
  }
}

module.exports = { checkObjects, checkInnerObject };
