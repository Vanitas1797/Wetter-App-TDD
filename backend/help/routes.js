const { NotExtended } = require('http-errors');
const validation = require('../validation/validation');

/**
 *
 * @returns {Promise<any>}
 */
async function exe() {}

module.exports = {
  /**
   *
   * @param {{exe:exe,request:{req,check},response,next}} data
   */
  async initRouter(data) {
    try {
      validation.endpoints.validateRequest_throws({
        request: data.request.req,
        check: data.request.check,
      });

      // let params = data.request.check.params;
      // let query = data.request.check.query;
      // let body = data.request.check.body;
      // params = data.request.req.params;
      // query = data.request.req.query;
      // body = data.request.req.body;

      const builtResponse = await data.exe();

      data.response.json(builtResponse);
    } catch (error) {
      data.next(error);
    }
  },
};
