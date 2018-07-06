const debug = require('debug')('freelancer:lib:middleware:errorHandler'); // eslint-disable-line no-unused-vars

const env = require('../environment');
const utils = require('../utils');

module.exports = function errorHandler(err, req, res, next) {
  // Sends stacktrace to user
  if (env.nodeEnv === 'development') {
    err.status = err.status || 500;
    res.status(err.status);
    utils.logError(req, err);
    res.sendErrorNotificationEmail(err);
    if (typeof err.details === 'object') {
      return res.render(err.details.serverTemplateLayout, {
        serverTemplateName: err.details.serverTemplateName,
        profile: data.profile
      });
    }
    else {
      return res.render('error', {
        message: err.message,
        error: err
      });
    }
  }
  // No stacktraces leaked to user, redirects to error pages
  else {
    err.status = err.status || 500;
    res.status(err.status);
    utils.logError(req, err);
    res.sendErrorNotificationEmail(err);
    if (typeof err.details === 'object') {
      return res.render(err.details.serverTemplateLayout, {
        serverTemplateName: err.details.serverTemplateName,
        profile: data.profile
      });
    }
    else {
      const supportedErrorPages = [ 403, 404, 500, 502, 503, 504 ];
      if (supportedErrorPages.indexOf(err.status) === -1) {
        err.status = 500;
      }
      return res.redirect(`/errors/${err.status}-error.html`);
    }
  }
};