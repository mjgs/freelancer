const debug = require('debug')('freelancer:lib:apps:services:routes::payments:stripe'); // eslint-disable-line no-unused-vars
const express = require('express');
const Stripe = require('stripe');

const env = require('../environment');
const pricing = require('../../../data').pricing;
const profile = require('../../../data').profile;
const notifications = require('../notifications');
const utils = require('../utils');

const router = express.Router();
const stripe = Stripe(env.stripeSecretKey);

/*
 * POST /stripe
 */
router.post('/stripe', function processPayment(req, res, next) {
  const email = req.body.stripeEmail;
  const stripeToken = req.body.stripeToken;
  const service = req.body.service.toLowerCase();
  const package = req.body.package.toLowerCase();
  const amount = utils.getServicePrice(pricing.services, service, package);

  const serviceReadable = `${service.charAt(0).toUpperCase()}${service.slice(1)}`;
  const packageReadable = `${package.charAt(0).toUpperCase()}${package.slice(1)}`;

  if (env.stripeEnabled) {
    const stripeCustomerOptions = {
      description: `Customer for ${email}`,
      email: email,
      metadata: {
        service: service,
        package: package
      }
    };

    debug(`#processPayment: ${new Date().toISOString()} :: stripeCustomerOptions: ${JSON.stringify(stripeCustomerOptions, 0, 2)}`);

    stripeCustomerOptions.source = stripeToken;

    stripe.customers.create(stripeCustomerOptions, function(err, stripeCustomer) {
      if (err) {
        err.status = (err.rawType === 'card_error') ? 400 : 500;
        err.details = {
          service: service,
          package: package,
          amount: amount,
          email: email,
          stripeOperation: 'stripe.customers.create',
          stripeOptions: stripeCustomerOptions,
          serverTemplateName: 'pages/failure',
          serverTemplateLayout: 'layout'
        };
        return next(err);
      }

      const chargeOptions = {
        amount: `${amount}00`,
        currency: 'usd',
        description: `Purchase of software service: ${serviceReadable} ${packageReadable}`,
        statement_descriptor: 'Software Services',
        customer: stripeCustomer.id,
        metadata: {
          service: service,
          package: package
        }
      };

      stripe.charges.create(chargeOptions, function(err, stripeCharge) {
        if (err) {
          err.status = (err.rawType === 'card_error') ? 400 : 500;
          err.details = {
            service: service,
            package: package,
            amount: amount,
            email: email,
            stripeOperation: 'stripe.charges.create',
            stripeOptions: chargeOptions,
            serverTemplateName: 'pages/failure',
            serverTemplateLayout: 'layout'
          };
          return next(err);
        }

        const amountCharged = stripeCharge.amount / 100;

        // Send confirmation email (don't wait for notifications send to complete)
        const emailOptionsClient = notifications.email.purchaseConfirmation({
          service: stripeCharge.metadata.service,
          package: stripeCharge.metadata.package,
          amount: amountCharged,
          stripeChargeId: stripeCharge.id,
          receiverEmail: email,
          senderEmail: profile.email.sender,
          personalEmail: profile.email.receiver,
          name: profile.name
        });

        const emailOptionsMe = notifications.email.newPurchase({
          service: stripeCharge.metadata.service,
          package: stripeCharge.metadata.package,
          amount: amountCharged,
          stripeChargeId: stripeCharge.id,
          stripeCustomerId: stripeCustomer.id,
          clientEmail: email,
          senderEmail: profile.email.sender,
          receiverEmail: profile.email.receiver,
          name: profile.name
        });

        res.sendEmails([ emailOptionsClient, emailOptionsMe ], function(err) {
          if (err) {
            return next(err);
          }
        });

        const locals = {
          service: serviceReadable,
          package: packageReadable,
          amount: amountCharged,
          profile: profile,
          stripeChargeId: stripeCharge.id,
          clientEmail: email,
          serverTemplateName: 'pages/success'
        };

        return res.render('layout', locals);
      });
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
      serverTemplateLayout: 'layout'
    };
    return next(err);
  }
});

module.exports = router;
