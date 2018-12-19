const environment = require('../environment');

module.exports = function addEnvironment(req, res, next) {
  req.env = res.env = environment;
  return next();
};
