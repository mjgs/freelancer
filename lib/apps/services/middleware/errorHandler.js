const debug = require('debug')('freelancer:lib:apps:services:middleware:errorHandler'); // eslint-disable-line no-unused-vars

module.exports = function errorHandler(err, req, res, next) {
  err.code = err.code || 500;
  res.status(err.code);
  req.utils.logError(req, err);
  res.sendErrorNotificationEmail(err);

  var isAjaxRequest = (req.headers['content-type'] === 'application/json');

  debug(`${new Date().toISOString()} :: isAjaxRequest: ${JSON.stringify(isAjaxRequest, 0, 2)}`);

  if (isAjaxRequest) {
    const ret = {
      status: 'error',
      message: err.message,
      code: err.code,
      data: {
        err: (req.env.env === 'production') ? undefined : err
      }
    }
    debug(`${new Date().toISOString()} :: ret: ${JSON.stringify(ret, 0, 2)}`);
    return res.json(ret);
  }
  else {
    if (typeof err.details === 'object') {
      const renderDefaults = {
        serverTemplateName: 'pages/failure',
        pageTitle: 'Payment Failure'
      };
      const locals = Object.assign({}, renderDefaults, err.details);
      debug(`${new Date().toISOString()} :: locals: ${JSON.stringify(locals, 0, 2)}`);
      return res.render('layout', locals);
    }
    else {
      const supportedErrorPages = [ 403, 404, 500, 502, 503, 504 ];
      if (supportedErrorPages.indexOf(err.code) === -1) {
        err.code = 500;
      }
      return res.redirect(`/errors/${err.code}-error.html`);
    }
  }
};
