const debug = require('debug')('freelancer:lib:apps:services:routes:selection'); // eslint-disable-line no-unused-vars
const express = require('express');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
const router = express.Router();

const env = require('../environment');
const data = require('../data');
const utils = require('../utils');

/*
 * GET /selection
 */
router.get('/selection', csrf(), function selection(req, res) {
  const locals = {
    pricing: data.pricing,
    profile: data.profile,
    csrfToken: req.csrfToken(),
    serverTemplateName: 'pages/selection',
    pageTitle: 'Selection'
  };

  // Reset tokens
  delete req.session.selectionToken;
  delete req.session.paymentIntent;
  delete req.session.email;

  debug(`#showSelectionPage - locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

function createStripeCookie(req, res, next) {
  debug(`setting cookie stripePublishableKey: ${env.stripePublishableKey}`);
  res.cookie('stripePublishableKey', env.stripePublishableKey, { maxAge: 900000 });
  return next();
}

/*
 * POST /selection
 */
router.post('/selection', csrf(), createStripeCookie, function processSelection(req, res, next) {
  const serviceName = req.body.service.toLowerCase() || 'consultancy';
  const packageName = req.body.package.toLowerCase();

  const jwtPayload = {
    serviceName: serviceName,
    packageName: packageName,
    amount: Math.abs(utils.getService(data.pricing.services, serviceName, packageName).amount)
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

    // Remember the selection
    req.session.selectionToken = selectionToken;

    const locals = {
      serviceName: `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`,
      packageName: `${packageName.charAt(0).toUpperCase()}${packageName.slice(1)}`,
      amount: jwtPayload.amount,
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
