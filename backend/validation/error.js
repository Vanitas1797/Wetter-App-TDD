module.exports = {
  /**
   *
   * @param {string} message
   * @param {any[]} errorResults
   * @returns
   */
  listErrorResultsWithMessage(message, errorResults) {
    return `${message}: ${errorResults.join(', ')}`;
  },
  /**
   *
   * @param {any[]} errors
   * @param {string} message
   */
  buildError(errors, message) {
    if (errors.length) {
      this.listErrorResultsWithMessage(message, errors);
    }
  },
};
