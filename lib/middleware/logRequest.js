const debug = require('debug')('freelancer:lib:middleware:logRequest'); // eslint-disable-line no-unused-vars

const utils = require('../utils');

module.exports = function logRequest(tag) {
  return function logRequest(req, res, next) {
    debug(`${tag} :: ${JSON.stringify(utils.getRequestInfo(req), 0, 2)}`);
    return next();
  };
}
