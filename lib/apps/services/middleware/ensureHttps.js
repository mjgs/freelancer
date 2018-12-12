const debug = require('debug')('freelancer:lib:apps:services:middleware:ensureHttps'); // eslint-disable-line no-unused-vars

const environment = require('../../../environment');

module.exports = function ensureHttps(req, res, next) {
  const production = (req.app.get('env') === 'production');
  const http = (req.protocol === 'http');

  const ensureHttps = (production && http && environment.ensureSsl);

  debug(`ensureHttps: ${ensureHttps}`);

  if (ensureHttps) {
    const reditrectUrl = `https://${req.hostname}${req.url}`;
    debug(`redirecting to ${reditrectUrl}`);
    return res.redirect(reditrectUrl);
  }
  else {
    return next();
  }
};