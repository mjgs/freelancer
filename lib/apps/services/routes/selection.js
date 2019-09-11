const debug = require('debug')('freelancer:lib:apps:services:routes::payments:selection'); // eslint-disable-line no-unused-vars
const express = require('express');
const csrf = require('csurf');
const router = express.Router();

const data = require('../data');

/*
 * GET /selection
 */
router.get('/selection', csrf({ cookie: true }), function showSelectionPage(req, res) {
  const locals = {
    pricing: data.pricing,
    profile: data.profile,
    csrfToken: req.csrfToken(),
    serverTemplateName: 'pages/selection',
    pageTitle: 'Selection'
  };

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
