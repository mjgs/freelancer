const debug = require('debug')('freelancer:lib:server:middleware:addEnvironment'); // eslint-disable-line no-unused-vars
const environment = require('../environment');

debug(JSON.stringify(environment, 0, 2));

module.exports = function addEnvironment(req, res, next) {
  req.env = res.env = environment;
  return next();
};
