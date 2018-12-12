const environment = {
  debug: process.env.DEBUG,
  env: process.env.NODE_ENV,
  logFormat: process.env.LOG_FORMAT,
  logRequest: parseInt(process.env.LOG_REQUEST),
  ensureSsl: parseInt(process.env.ENSURE_SSL),
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  stripeEnabled: parseInt(process.env.STRIPE_ENABLED),
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  mailgunEnabled: parseInt(process.env.MAILGUN_ENABLED),
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  googleTmEnabled: parseInt(process.env.GOOGLE_TM_ENABLED),
  googleTmId: process.env.GOOGLE_TM_ID
};

module.exports = environment;
