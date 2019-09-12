const debug = require('debug')('freelancer:lib:apps:services:routes::payments:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
const router = express.Router();

const env = require('../environment');
const data = require('../data');
const utils = require('../utils');

function createStripeCookie(req, res, next) {
  debug(`setting cookie stripePublishableKey: ${env.stripePublishableKey}`);
  res.cookie('stripePublishableKey', env.stripePublishableKey, { maxAge: 900000 });
  return next();
}

/*
 * POST /purchase
 */
router.post('/purchase', csrf({ cookie: true }), createStripeCookie, function processSelection(req, res, next) {
  const jwtPayload = {
    serviceName: req.body.service.toLowerCase() || 'consultancy',
    packageName: req.body.package.toLowerCase()
  };

  const jwtOptions = {
    expiresIn: env.jwtExpiresIn
  };

  debug(`jwtPayload: ${JSON.stringify(jwtPayload, 0, 2)}`);
  debug(`jwtOptions: ${JSON.stringify(jwtOptions, 0, 2)}`);

  jwt.sign(jwtPayload, env.jwtSecretKey, jwtOptions, function(err, selectionToken) {
    if (err) {
      return next(err);
    }

    const locals = {
      serviceName: `${jwtPayload.serviceName.charAt(0).toUpperCase()}${jwtPayload.serviceName.slice(1)}`,
      packageName: `${jwtPayload.packageName.charAt(0).toUpperCase()}${jwtPayload.packageName.slice(1)}`,
      amount: utils.getService(data.pricing.services, jwtPayload.serviceName, jwtPayload.packageName).amount,
      profile: data.profile,
      purchasePage: true,
      serverTemplateName: 'pages/purchase',
      csrfToken: req.csrfToken(),
      selectionToken: selectionToken,
      pageTitle: 'Purchase'
    };

    debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

    return res.render('layout', locals);
  });
});

module.exports = router;
