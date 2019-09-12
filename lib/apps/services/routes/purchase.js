const debug = require('debug')('freelancer:lib:apps:services:routes:purchase'); // eslint-disable-line no-unused-vars
const express = require('express');
const Stripe = require('stripe');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const env = require('../environment');

const router = express.Router();
const stripe = Stripe(env.stripeSecretKey);

const validateCsrf = csrf({ cookie: true });
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
router.post('/purchase', [ validateCsrf, decodeSelectionToken ], function processPayment(req, res, next) {
  const selectionToken = req.body.selectionToken || req.query.selectionToken;
  const email = req.body.email;
  const paymentMethodId = req.body.paymentMethodId;
  const serviceName = req.decodedSelectionJwt.serviceName.toLowerCase();
  const packageName = req.decodedSelectionJwt.packageName.toLowerCase();
  const amount = req.decodedSelectionJwt.amount;

  const serviceReadable = `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`;
  const packageReadable = `${packageName.charAt(0).toUpperCase()}${packageName.slice(1)}`;

  if (env.stripeEnabled) {
    const stripePaymentIntentOptions = {
      payment_method: paymentMethodId,
      amount: amount,
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

    debug(`#processPayment: ${new Date().toISOString()} :: stripePaymentIntentOptions: ${JSON.stringify(stripePaymentIntentOptions, 0, 2)}`);

    stripe.paymentIntents.create(stripePaymentIntentOptions, function(err, stripePaymentIntent) {
      if (err) {
        err.status = (err.rawType === 'card_error') ? 400 : 500;
        err.details = {
          service: serviceName,
          package: packageName,
          amount: amount,
          email: email,
          stripeOperation: 'stripe.paymentIntents.create',
          stripeOptions: stripePaymentIntentOptions,
          serverTemplateName: 'pages/failure',
          serverTemplateLayout: 'layout'
        };
        return next(err);
      }

      debug(`#processPayment: ${new Date().toISOString()} :: stripePaymentIntent: ${JSON.stringify(stripePaymentIntent, 0, 2)}`);

      const response = generate_payment_response(stripePaymentIntent);

      // Create a jwt for the transaction
      const jwtPayload = {
        stripePaymentIntentId: stripePaymentIntent.id,
        clientEmail: stripePaymentIntent.receipt_email,
        paymentResponse: response
      };

      const jwtOptions = {
        expiresIn: env.jwtExpiresIn
      };

      debug(`#processPayment - jwtPayload: ${JSON.stringify(jwtPayload, 0, 2)}`);
      debug(`#processPayment - jwtOptions: ${JSON.stringify(jwtOptions, 0, 2)}`);

      jwt.sign(jwtPayload, env.jwtSecretKey, jwtOptions, function(err, transactionToken) {
        if (err) {
          return next(err);
        }

        response.tokens = {
          selection: selectionToken,
          transaction: transactionToken
        }

        debug(`#processPayment: ${new Date().toISOString()} :: paymentResponse: ${JSON.stringify(response, 0, 2)}`);

        return res.json(response);
      });
    });
  }
  else {
    const err = (new Error("Stripe is not enabled"));
    err.status = 500;
    err.details = {
      service: serviceName,
      package: packageName,
      amount: amount,
      email: email,
      serverTemplateName: 'pages/failure',
      pageTitle: 'Payment Failure'
    };
    return next(err);
  }
});

const generate_payment_response = (intent) => {
  if (
    intent.status === 'requires_source_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  }
  else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  }
  else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};

module.exports = router;
