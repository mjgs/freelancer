const debug = require('debug')('freelancer:lib:apps:services:routes::payments:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const csrf = require('csurf');
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
router.post('/purchase', csrf({ cookie: true }), createStripeCookie, function processSelection(req, res) {
  const serviceName = req.body.service.toLowerCase() || 'consultancy';
  const packageName = req.body.package.toLowerCase();

  const locals = {
    serviceName: `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`,
    packageName: `${packageName.charAt(0).toUpperCase()}${packageName.slice(1)}`,
    amount: utils.getService(data.pricing.services, serviceName, packageName).amount,
    profile: data.profile,
    purchasePage: true,
    serverTemplateName: 'pages/purchase',
    csrfToken: req.csrfToken(),
    pageTitle: 'Purchase'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
