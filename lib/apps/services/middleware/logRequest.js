const debug = require('debug')('freelancer:lib:apps:service:middleware:logRequest'); // eslint-disable-line no-unused-vars

module.exports = function logRequest(req, res, next) {
  if (req.env.logRequest) {
    debug(`logRequest >> ip ${req.ip} >> ${JSON.stringify(req.utils.getRequestInfo(req), 0, 2)}`);
  }
  return next();
};
