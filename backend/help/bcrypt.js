const bcrypt = require('bcrypt');

module.exports = {
  encryptPassword(password) {
    return bcrypt.hash(password, 10);
  },
  /**
   *
   * @param {{check,encrypted}} passwords
   */
  decryptPassword(passwords) {
    return bcrypt.compare(passwords.check, passwords.encrypted);
  },
};
