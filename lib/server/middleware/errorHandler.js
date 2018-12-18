const debug = require('debug')('freelancer:lib:server:middleware:errorHandler'); // eslint-disable-line no-unused-vars

const data = require('../data');

module.exports = function errorHandler(err, req, res, next) {
  // Sends stacktrace to user
  if (req.env.env === 'development') {
    err.status = err.status || 500;
    res.status(err.status);
    req.utils.logError(req, err);
    return res.render('error', {
      message: err.message,
      error: err
    });
  }
  // No stacktraces leaked to user, redirects to error pages
  else {
    err.status = err.status || 500;
    res.status(err.status);
    req.utils.logError(req, err);
    const supportedErrorPages = [ 403, 404, 500, 502, 503, 504 ];
    if (supportedErrorPages.indexOf(err.status) === -1) {
      err.status = 500;
    }
    return res.redirect(`/errors/${err.status}-error.html`);
  }
};
