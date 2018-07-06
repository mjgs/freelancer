const express = require('express');
const router = express.Router();

router.use('/', require('./selection'));
router.use('/', require('./purchase'));
router.use('/', require('./stripe'));

module.exports = router;
