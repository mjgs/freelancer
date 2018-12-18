const environment = {
  debug: process.env.DEBUG,
  env: process.env.NODE_ENV,
  logFormat: process.env.LOG_FORMAT,
  logRequest: parseInt(process.env.LOG_REQUEST),
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  googleTmEnabled: parseInt(process.env.GOOGLE_TM_ENABLED),
  googleTmId: process.env.GOOGLE_TM_ID
};

module.exports = environment;
