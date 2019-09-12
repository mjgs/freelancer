const debug = require('debug')('freelancer:lib:apps:services:routes:pricing'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();

const data = require('../data');

/*
 * GET /pricing
 */
router.get('/pricing', function showPricingPage(req, res) {
  const locals = {
    pricing: data.pricing,
    profile: data.profile,
    serverTemplateName: 'pages/pricing',
    pageTitle: 'Pricing'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
