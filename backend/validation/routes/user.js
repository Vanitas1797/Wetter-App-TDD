const createHttpError = require('http-errors');
const database = require('../../database/database');
const { decryptPassword } = require('../../help/bcrypt');
const time = require('../../help/time');
const { tables } = require('../../objects/database/tables');
const object = require('../../routes/user/object');
module.exports = {
  /**
   *
   * @param {{new_password,repeat_new_password}} passwords
   */
  resetPassword(passwords) {
    if (passwords.new_password != passwords.repeat_new_password) {
      throw createHttpError.BadRequest('Both passwords must be the same');
    }
  },
  /**
   *
   * @param {{email,password}} data
   */
  register(data) {
    this.createPassword(data.password);
    createEmail(data.email);
  },
  createPassword(password) {
    const maxLength = 30;
    const minLength = 6;
    const isLength =
      password.length >= minLength && password.length <= maxLength;
    const hasNumbers = password.match(/[0-9]+/g);
    const hasSpecialCharacters = password.match(/[^\w\s]+/g);
    const hasCommonCharacters = password.match(/[a-zA-Z]+/g);
    if (
      !(isLength && hasNumbers && hasSpecialCharacters && hasCommonCharacters)
    ) {
      throw createHttpError.BadRequest(
        'Password does not match the requirements. It must have a length between ' +
          minLength +
          ' and ' +
          maxLength +
          ' and at least 1 special, 1 number and 1 common characters'
      );
    }
  },
  /**
   *
   * @param {{realPassword,password}} data
   */
  deleteAccount(data) {
    if (
      !decryptPassword({
        check: data.realPassword,
        encrypted: data.password,
      })
    ) {
      throw createHttpError.BadRequest('Password is wrong');
    }
  },
};

function createEmail(email) {
  const hasEmailFormat = email.match(/^[-\w.]+@[\w.-]+\.[a-z]+$/);
  if (!hasEmailFormat) {
    throw createHttpError.BadRequest(
      'E-Mail does not match the correct format'
    );
  }
}
