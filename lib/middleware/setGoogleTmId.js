const debug = require('debug')('freelancer:lib:middleware:setGoogleTmId'); // eslint-disable-line no-unused-vars

const env = require('../environment');

module.exports = function setGoogleTmId(req, res, next) {
  res.locals.googleTmId = env.googleTmId;
  res.locals.googleTmEnabled = env.googleTmEnabled;

  debug (`setting res.locals.googleTmId: ${res.locals.googleTmId}`);
  debug (`setting res.locals.googleTmEnabled: ${res.locals.googleTmEnabled}`);

  return next();
};