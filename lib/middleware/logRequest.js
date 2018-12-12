const debug = require('debug')('freelancer:lib:middleware:logRequest'); // eslint-disable-line no-unused-vars

const environment = require('../environment');
const utils = require('../utils');

module.exports = function logRequest(tag) {
  return function logRequest(req, res, next) {
    if (environment.logRequest) {
      debug(`logRequest :: ip ${req.ip} :: ${tag} :: ${JSON.stringify(utils.getRequestInfo(req), 0, 2)}`);
    }
    return next();
  };
};
