const debug = require('debug')('freelancer:lib:server:middleware:setGoogleTmId'); // eslint-disable-line no-unused-vars

module.exports = function setGoogleTmId(req, res, next) {
  res.locals.googleTmId = req.env.googleTmId;
  res.locals.googleTmEnabled = req.env.googleTmEnabled;

  debug (`setting res.locals.googleTmId: ${res.locals.googleTmId}`);
  debug (`setting res.locals.googleTmEnabled: ${res.locals.googleTmEnabled}`);

  return next();
};
