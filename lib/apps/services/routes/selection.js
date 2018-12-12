const debug = require('debug')('freelancer:lib:apps:services:routes::payments:selection'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();

const pricing = require('../../../data/pricing');
const profile = require('../../../data/profile');

/*
 * GET /payments/selection
 */
router.get('/selection', function showSelectionPage(req, res) {
  const locals = {
    pricing: pricing,
    profile: profile,
    serverTemplateName: 'selection'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('payments/layout', locals);
});

module.exports = router;
