const debug = require('debug')('freelancer:lib:apps:services:routes::payments:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();

const env = require('../environment');
const data = require('../data');
const utils = require('../utils');

/*
 * POST /purchase
 */
router.post('/purchase', function processSelection(req, res) {
  const serviceName = req.body.service.toLowerCase() || 'consultancy';
  const packageName = req.body.package.toLowerCase();

  const locals = {
    serviceName: `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`,
    packageName: `${packageName.charAt(0).toUpperCase()}${packageName.slice(1)}`,
    amount: utils.getService(data.pricing.services, serviceName, packageName).amount,
    stripePublishableKey: env.stripePublishableKey,
    profile: data.profile,
    serverTemplateName: 'pages/purchase',
    pageTitle: 'Purchase'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
