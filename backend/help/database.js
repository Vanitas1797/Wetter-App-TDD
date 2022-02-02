module.exports = {
  firstSubstring(stringArray) {
    stringArrayResult = [];
    stringArray.forEach((v, i) => {
      v ? (v += '%') : null;
      stringArrayResult[i] = v;
    });

    return stringArrayResult;
  },
};
