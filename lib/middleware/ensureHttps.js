const debug = require('debug')('freelancer:lib:middleware:ensureHttps'); // eslint-disable-line no-unused-vars

module.exports = function ensureHttps(req, res, next) {
  const production = (req.app.get('env') === 'production');
  const http = (req.protocol === 'http');
  if (production && http) {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  else {
    return next();
  }
};
