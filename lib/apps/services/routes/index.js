const express = require('express');
const router = express.Router();

const middleware = require('../middleware');

router.use(middleware.ensureHttps);

router.use('/', require('./selection'));
router.use('/', require('./purchase'));
router.use('/', require('./stripe'));

router.use('/', function(req, res) {
  return res.redirect('/payments/selection');
});

module.exports = router;
