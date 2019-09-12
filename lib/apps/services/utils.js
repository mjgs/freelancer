const debug = require('debug')('freelancer:lib:apps:services:utils'); // eslint-disable-line no-unused-vars
const jwt = require('jsonwebtoken');

const env = require('./environment');
const notifications = require('./notifications');

function getService(services, serviceName, packageName) {
  let price = undefined;
  services.every(function(element, index) {
    if (element.name === serviceName) {
      price = services[index].packages[packageName];
      return false // break out of the loop
    }
    else {
      return true; // Next item
    }
  });

  return price;
};

function safeLoggingReplacer(key, value) {
  const keysToRedact = [
    'stripeSecretKey',
    'mailgunApiKey',
    'jwtSecretKey'
  ];

  if ((keysToRedact.indexOf(key) !== -1) && (value !== '')) {
    return `object key redacted for debug printing - key name: ${key}`;
  }
  return value;
};

function sendSuccessNotifications(res, locals) {
  // Send confirmation email (don't wait for notifications send to complete)
  const emailOptionsClient = notifications.email.purchaseConfirmation({
    serviceName: locals.serviceName,
    packageName: locals.packageName,
    amount: locals.amount,
    transacationReference: locals.stripePaymentIntentId,
    clientEmail: locals.clientEmail,
    senderEmail: locals.profile.email.sender,
    receiverEmail: locals.profile.email.receiver,
    name: locals.profile.name
  });

  const emailOptionsMe = notifications.email.newPurchase({
    serviceName: locals.serviceName,
    packageName: locals.packageName,
    amount: locals.amount,
    transacationReference: locals.stripePaymentIntentId,
    clientEmail: locals.clientEmail,
    senderEmail: locals.profile.email.sender,
    receiverEmail: locals.profile.email.receiver,
    name: locals.profile.name
  });

  const emailsOptions = [ emailOptionsClient, emailOptionsMe ];

  debug(`#sendNotifications: ${new Date().toISOString()} :: emailsOptions: ${JSON.stringify(emailsOptions, 0, 2)}`);

  res.sendEmails(emailsOptions, function(err) {
    if (err) {
      return next(err);
    }
  });
};

function generatePaymentResponse(stripePaymentIntent, selectionToken, cb) {
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

  debug(`#generatePaymentResponse - jwtPayload: ${JSON.stringify(jwtPayload, 0, 2)}`);
  debug(`#generatePaymentResponse - jwtOptions: ${JSON.stringify(jwtOptions, 0, 2)}`);

  jwt.sign(jwtPayload, env.jwtSecretKey, jwtOptions, function(err, transactionToken) {
    if (err) {
      return cb(err);
    }

    response.tokens = {
      selection: selectionToken,
      transaction: transactionToken
    }

    debug(`#generatePaymentResponse: ${new Date().toISOString()} :: response: ${JSON.stringify(response, 0, 2)}`);

    return cb(null, response);
  });
};

module.exports = {
  getService: getService,
  safeLoggingReplacer: safeLoggingReplacer,
  sendSuccessNotifications: sendSuccessNotifications,
  generatePaymentResponse: generatePaymentResponse
};
