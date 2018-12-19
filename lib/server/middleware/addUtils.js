const utils = require('../utils');

module.exports = function addUtils(req, res, next) {
  res.utils = req.utils = utils;
  return next();
};
