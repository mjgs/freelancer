const debug = require('debug')('freelancer:lib:apps:services:routes::payments:stripe'); // eslint-disable-line no-unused-vars
const express = require('express');
const Stripe = require('stripe');
const csrf = require('csurf');

const env = require('../environment');
const data = require('../data');
const utils = require('../utils');

const router = express.Router();
const stripe = Stripe(env.stripeSecretKey);

/*
 * POST /stripe
 */
router.post('/stripe', csrf({ cookie: true }), function processPayment(req, res, next) {
  const email = req.body.stripeEmail;
  const paymentMethodId = req.body.paymentMethodId;
  const service = req.body.service.toLowerCase();
  const package = req.body.package.toLowerCase();
  const amount = Math.abs(utils.getService(data.pricing.services, service, package).amount);

  const serviceReadable = `${service.charAt(0).toUpperCase()}${service.slice(1)}`;
  const packageReadable = `${package.charAt(0).toUpperCase()}${package.slice(1)}`;

  if (env.stripeEnabled) {
    const stripePaymentIntentOptions = {
      payment_method: paymentMethodId,
      amount: amount,
      currency: env.currency.toLower(),
      confirmation_method: 'manual',
      confirm: true,
      receipt_email: email,
      description: `Purchase of software service: ${serviceReadable} ${packageReadable}`,
      statement_descriptor: 'Software Services',
      metadata: {
        service: service,
        package: package
      }
    };

    debug(`#processPayment: ${new Date().toISOString()} :: stripePaymentIntentOptions: ${JSON.stringify(stripePaymentIntentOptions, 0, 2)}`);

    stripe.paymentIntents.create(stripePaymentIntentOptions, function(err, stripePaymentIntent) {
      if (err) {
        err.status = (err.rawType === 'card_error') ? 400 : 500;
        err.details = {
          service: service,
          package: package,
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

      const response = generate_payment_response(stripePaymentIntent)
       
      if (response.status) {
        const amountCharged = amount / 100;
        utils.sendNotifications(res, amountCharged, stripePaymentIntent, data.profile);
      }

      return res.json(response);
    });
  }
  else {
    const err = (new Error("Stripe is not enabled"));
    err.status = 500;
    err.details = {
      service: service,
      package: package,
      amount: amount,
      email: email,
      serverTemplateName: 'pages/failure',
      pageTitle: 'Payment Failure'
    };
    return next(err);
  }
});

module.exports = router;
