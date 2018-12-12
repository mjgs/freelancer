const debug = require('debug')('freelancer:lib:apps:services:routes::payments:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();

const env = require('../environment');
const pricing = require('../../../data').pricing;
const profile = require('../../../data').profile;
const utils = require('../utils');

/*
 * POST /payments/purchase
 */
router.post('/purchase', function processSelection(req, res) {
  const service = req.body.service.toLowerCase() || 'consultancy';
  const package = req.body.package.toLowerCase();

  const locals = {
    service: `${service.charAt(0).toUpperCase()}${service.slice(1)}`,
    package: `${package.charAt(0).toUpperCase()}${package.slice(1)}`,
    amount: utils.getServicePrice(pricing, service, package),
    stripePublishableKey: env.stripePublishableKey,
    profile: profile,
    serverTemplateName: 'purchase'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('payments/layout', locals);
});

module.exports = router;
