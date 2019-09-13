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
    amount: req.decodedSelectionJwt.amount,
    transactionReference: req.decodedTransactionJwt.stripePaymentIntentId,
    clientEmail: req.decodedTransactionJwt.clientEmail,
    profile: data.profile
  }

  debug(`#paymentSuccess: ${new Date().toISOString()} :: req.decodedSelectionJwt: ${JSON.stringify(req.decodedSelectionJwt, 0, 2)}`);
  debug(`#paymentSuccess: ${new Date().toISOString()} :: req.decodedTransactionJwt: ${JSON.stringify(req.decodedTransactionJwt, 0, 2)}`);

  // Errors will always get displayed in the client and this page only gets loaded
  // when there is no error and no action required by client, so success should always
  // be true here
  if (req.decodedTransactionJwt.paymentResponse.success) {
    locals.pageTitle = 'Payment Success';
    locals.serverTemplateName = 'pages/success';
    utils.sendSuccessNotifications(res, locals);
  }
  // Just in case some unnexpected state occurs
  else {
    const err = (new Error("There was an error payment response returned from Stripe"));
    err.status = 500;
    err.details = {
      service: locals.serviceName,
      package: locals.packageName,
      amount: locals.amount,
      email: locals.clientEmail,
      serverTemplateName: 'pages/failure',
      pageTitle: 'Payment Failure'
    };
    return next(err);
  }

  debug(`locals: ${JSON.stringify(locals, 0, 2)}`);

  return res.render('layout', locals);
});

module.exports = router;
