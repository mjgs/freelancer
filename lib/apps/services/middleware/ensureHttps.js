const debug = require('debug')('freelancer:lib:apps:services:middleware:ensureHttps'); // eslint-disable-line no-unused-vars

module.exports = function ensureHttps(req, res, next) {
  const production = (req.app.get('env') === 'production');
  const http = (req.protocol === 'http');

  const ensureHttps = (production && http && (req.env.ensureServicesSsl === 1));

  debug(`ensureHttps: ${ensureHttps}`);

  if (ensureHttps) {
    const redirectUrl = `https://${req.hostname}${req.url}`;
    debug(`redirecting to ${redirectUrl}`);
    return res.redirect(redirectUrl);
  }
  else {
    return next();
  }
};
