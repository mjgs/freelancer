const environment = require('../environment');

module.exports = function addEnvironment(req, res, next) {
  const mergedEnvironments = Object.assign({}, req.env, environment);
  res.env = req.env = mergedEnvironments;
  return next();
};
