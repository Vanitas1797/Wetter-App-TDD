const time = require('../../help/time');

module.exports = {
  dateInPast(date) {
    const now = new Date().setHours(0, 0, 0, 0);
    let datePast = time.getDate(date.date, date.timezone).setHours(0, 0, 0, 0);

    if (datePast > now) {
      throw new Error('Date must be in the past');
    }
  },
};
