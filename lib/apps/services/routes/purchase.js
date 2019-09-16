const debug = require('debug')('freelancer:lib:apps:services:routes:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const Stripe = require('stripe');
const csrf = require('csurf');
const expressJwt = require('express-jwt');

const data = require('../data');
const env = require('../environment');
const utils = require('../utils');

const router = express.Router();
const stripe = Stripe(env.stripeSecretKey);

const decodeSelectionToken = expressJwt({
  secret: env.jwtSecretKey,
  requestProperty: 'decodedSelectionJwt',
  getToken: function fromBody(req) {
    const token = req.body.selectionToken || req.query.selectionToken;
    debug(`#decodeSelectionToken - getToken: ${token}`);
    return token;
  }
});

/*
 * POST /purchase
 */
router.post('/purchase', [ csrf(), decodeSelectionToken ], function processPayment(req, res, next) {
  const selectionToken = req.body.selectionToken || req.query.selectionToken;
  const email = req.body.email;
  const paymentMethodId = req.body.paymentMethodId;
  const paymentIntentId = req.body.paymentIntentId;
  const serviceName = req.decodedSelectionJwt.serviceName.toLowerCase();
  const packageName = req.decodedSelectionJwt.packageName.toLowerCase();
  const amount = req.decodedSelectionJwt.amount;

  const serviceReadable = `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`;
  const packageReadable = `${packageName.charAt(0).toUpperCase()}${packageName.slice(1)}`;

  if (req.session.selectionToken !== selectionToken) {
    debug(`Invalid selection token: ${selectionToken}`);

    const err = (new Error("Supplied selection token is invalid"));
    err.code = 500;
    err.details = {
      selectionToken: selectionToken,
      clientEmail: email,
      receiverEmail: data.profile.email.receiver,
      serverTemplateName: 'pages/failure',
      pageTitle: 'Payment Failure'
    };
    return next(err);
  }
  else {
    debug(`Valid selection token: ${selectionToken}`);
  }

  if (env.stripeEnabled) {
    if (paymentIntentId) {
      const paymentIntentConfirmationOptions = {};

      debug(`#processPayment: ${new Date().toISOString()} :: paymentIntentConfirmationOptions: ${JSON.stringify(paymentIntentConfirmationOptions, 0, 2)}`);

      stripe.paymentIntents.confirm(paymentIntentId, paymentIntentConfirmationOptions, function(err, stripePaymentIntent) {
        if (err) {
          err.code = (err.rawType === 'card_error') ? 400 : 500;
          err.details = {
            service: serviceName,
            package: packageName,
            amount: amount,
            clientEmail: email,
            receiverEmail: data.profile.email.receiver,
            stripeOperation: 'stripe.paymentIntents.confirm',
            stripeOptions: paymentIntentConfirmationOptions,
            serverTemplateName: 'pages/failure',
            serverTemplateLayout: 'layout'
          };
          return next(err);
        }

        debug(`#processPayment: ${new Date().toISOString()} :: stripePaymentIntent: ${JSON.stringify(stripePaymentIntent, 0, 2)}`);

        utils.generatePaymentResponse(stripePaymentIntent, selectionToken, function(err, ret) {
          if (err) {
            return next(err);
          }
          return res.json(ret);
        });
      });
    }
    else {
      const paymentIntentCreationOptions = {
        payment_method: paymentMethodId,
        amount: amount * 100,
        currency: env.currency.toLowerCase(),
        confirmation_method: 'manual',
        confirm: true,
        receipt_email: email,
        description: `Purchase of software service: ${serviceReadable} ${packageReadable}`,
        statement_descriptor: 'Software Services',
        metadata: {
          service: serviceName,
          package: packageName
        }
      };

      debug(`#processPayment: ${new Date().toISOString()} :: paymentIntentCreationOptions: ${JSON.stringify(paymentIntentCreationOptions, 0, 2)}`);

      stripe.paymentIntents.create(paymentIntentCreationOptions, function(err, stripePaymentIntent) {
        if (err) {
          err.code = (err.rawType === 'card_error') ? 400 : 500;
          err.details = {
            service: serviceName,
            package: packageName,
            amount: amount,
            clientEmail: email,
            receiverEmail: data.profile.email.receiver,
            stripeOperation: 'stripe.paymentIntents.create',
            stripeOptions: paymentIntentCreationOptions,
            serverTemplateName: 'pages/failure',
            serverTemplateLayout: 'layout'
          };
          return next(err);
        }

        debug(`#processPayment: ${new Date().toISOString()} :: stripePaymentIntent: ${JSON.stringify(stripePaymentIntent, 0, 2)}`);

        utils.generatePaymentResponse(stripePaymentIntent, selectionToken, function(err, ret) {
          if (err) {
            return next(err);
          }
          return res.json(ret);
        });
      });
    }
  }
  else {
    const err = (new Error("Stripe is not enabled"));
    err.code = 500;
    err.details = {
      service: serviceName,
      package: packageName,
      amount: amount,
      clientEmail: email,
      receiverEmail: data.profile.email.receiver,
      serverTemplateName: 'pages/failure',
      pageTitle: 'Payment Failure'
    };
    return next(err);
  }
});

module.exports = router;
