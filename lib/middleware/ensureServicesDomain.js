const debug = require('debug')('freelancer:lib:middleware:ensureServicesDomain'); // eslint-disable-line no-unused-vars

const profile = require('../data').profile;

module.exports = function ensureServicesDomain(req, res, next) {
  if (req.host === profile.domains.services) {
    debug('requested site is the services domain');
    return next();
  }
  else {
    debug('requested site is not the services domain');
    const err = new Error('Not Found.');
    err.status = 404;
    return next(err);
  }
};
