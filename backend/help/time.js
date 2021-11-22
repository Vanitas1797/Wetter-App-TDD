module.exports = {
  /**
   *
   * @param {{ms,s,mi,h,d,w,mo,y}} time
   * @returns
   */
  days(time) {
    return this.hours(time) / 24;
  },
  /**
   *
   * @param {{ms,s,mi,h,d,w,mo,y}} time
   * @returns
   */
  hours(time) {
    return this.minutes(time) / 60;
  },
  /**
   *
   * @param {{ms,s,mi,h,d,w,mo,y}} time
   * @returns
   */
  minutes(time) {
    return this.seconds(time) / 60;
  },
  /**
   *
   * @param {{ms,s,mi,h,d,w,mo,y}} time
   * @returns
   */
  seconds(time) {
    return time / 1000;
  },
};

/**
 *
 * @param {{ms,s,mi,h,d,w,mo,y}} time
 * @returns
 */
function sumOfAll(time) {
  let sum = 0;
  Object.values(time).forEach((v) => (sum += v));
}

sumOfAll({ d: 365 });
