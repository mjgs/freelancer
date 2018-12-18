const debug = require('debug')('freelancer:lib:apps:services:routes::payments:selection'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();

const pricing = require('../../../data/pricing');
const profile = require('../../../data/profile');

/*
 * GET /selection
 */
router.get('/selection', function showSelectionPage(req, res) {
  const locals = {
    pricing: pricing,
    profile: profile,
    serverTemplateName: 'pages/selection',
    pageTitle: 'Selection'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
