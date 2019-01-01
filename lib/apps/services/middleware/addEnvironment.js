const debug = require('debug')('freelancer:lib:apps:services:middleware:addEnvironment'); // eslint-disable-line no-unused-vars
const environment = require('../environment');
const utils = require('../utils');

debug(JSON.stringify(environment, utils.safeLoggingReplacer, 2));

module.exports = function addEnvironment(req, res, next) {
  const mergedEnvironments = Object.assign({}, req.env, environment);
  res.env = req.env = mergedEnvironments;
  return next();
};
