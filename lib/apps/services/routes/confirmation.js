const debug = require('debug')('freelancer:lib:apps:services:routes:confirmation'); // eslint-disable-line no-unused-vars
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');

const data = require('../data');
const env = require('../environment');
const utils = require('../utils');

const decodeSelectionToken = expressJwt({
  secret: env.jwtSecretKey,
  requestProperty: 'decodedSelectionJwt',
  getToken: function(req) {
    const token = req.body.selectionToken || req.query.selectionToken;
    debug(`#decodeSelectionToken - getToken: ${token}`);
    return token;
  }
});

const decodeTransactionToken = expressJwt({
  secret: env.jwtSecretKey,
  requestProperty: 'decodedTransactionJwt',
  getToken: function(req) {
    const token = req.body.transactionToken || req.query.transactionToken;
    debug(`#decodeTransactionToken - getToken: ${token}`);
    return token;
  }
});

/*
 * GET /confirmation
 */
router.get('/confirmation', [ decodeSelectionToken, decodeTransactionToken ], function paymentSuccess(req, res, next) {
  const locals = {
    serviceName: req.decodedSelectionJwt.serviceName,
    packageName: req.decodedSelectionJwt.packageName,
    amount: req.decodedSelectionJwt.amount / 100,
    transactionReference: req.decodedTransactionJwt.stripePaymentIntentId,
    clientEmail: req.decodedTransactionJwt.clientEmail,
    profile: data.profile
  }

  if (req.decodedTransactionJwt.paymentResponse.success) {
    locals.pageTitle = 'Payment Success';
    locals.serverTemplateName = 'pages/success';
    utils.sendSuccessNotifications(res, locals);
  }
  else if (req.decodedTransactionJwt.paymentResponse.error) {
    locals.pageTitle = 'Payment Failure';
    locals.serverTemplateName = 'pages/failure';
    utils.sendFailureNotifications(res, locals);
  }

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
