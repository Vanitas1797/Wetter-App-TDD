const bcrypt = require('bcrypt');

module.exports = {
  encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  },
  /**
   *
   * @param {{check,encrypted}} passwords
   */
  decryptPassword(passwords) {
    return bcrypt.compareSync(passwords.check, passwords.encrypted);
  },
};
