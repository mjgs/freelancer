const environment = {
  debug: process.env.DEBUG,
  env: process.env.NODE_ENV,
  ensureServicesSsl: parseInt(process.env.ENSURE_SERVICES_SSL),
  logFormat: process.env.LOG_FORMAT,
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  stripeEnabled: parseInt(process.env.STRIPE_ENABLED),
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  mailgunEnabled: parseInt(process.env.MAILGUN_ENABLED),
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  googleTmEnabled: parseInt(process.env.GOOGLE_TM_ENABLED),
  googleTmId: process.env.GOOGLE_TM_ID,
  currency: process.env.CURRENCY,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN),
  sessionsSecretKey: process.env.SESSIONS_SECRET_KEY,
  enableSesionsSecureCookies: parseInt(process.ENABLE_SESSIONS_SECURE_COOKIES)
};

module.exports = environment;
