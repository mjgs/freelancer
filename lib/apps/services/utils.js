const debug = require('debug')('freelancer:lib:apps:services:utils'); // eslint-disable-line no-unused-vars

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
}

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
}

module.exports = {
  getService: getService,
  safeLoggingReplacer: safeLoggingReplacer,
  sendSuccessNotifications: sendSuccessNotifications
};
