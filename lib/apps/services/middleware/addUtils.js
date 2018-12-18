const utils = require('../utils');

module.exports = function addUtils(req, res, next) {
  const mergedUtils = Object.assign({}, req.utils, utils);
  res.utils = req.utils = mergedUtils;
  return next();
};
