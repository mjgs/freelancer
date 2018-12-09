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

  return res.render('payments/layout', locals);
});

module.exports = router;
