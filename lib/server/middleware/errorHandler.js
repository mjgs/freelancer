const debug = require('debug')('freelancer:lib:server:middleware:errorHandler'); // eslint-disable-line no-unused-vars

const data = require('../data');

module.exports = function errorHandler(err, req, res, next) {
  err.code = err.code || 500;
  res.status(err.code);
  req.utils.logError(req, err);

  // Sends stacktrace to user
  if (req.env.env === 'development') {
    return res.render('error', {
      message: err.message,
      error: err
    });
  }
  // No stacktraces leaked to user, redirects to error pages
  else {
    const supportedErrorPages = [ 403, 404, 500, 502, 503, 504 ];
    if (supportedErrorPages.indexOf(err.code) === -1) {
      err.code = 500;
    }
    return res.redirect(`/errors/${err.code}-error.html`);
  }
};
