const express = require('express');
const router = express.Router();

const middleware = require('../middleware');

router.use(middleware.ensureHttps);

router.use('/', require('./selection'));
router.use('/', require('./pricing'));
router.use('/', require('./purchase'));
router.use('/', require('./confirmation'));

module.exports = router;
