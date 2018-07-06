#!/usr/bin/env node
const debug = require('debug')('freelancer:app');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const responseTime = require('response-time');

const middleware = require('./lib/middleware');
const routes = require('./lib/routes');
const environment = require('./lib/environment');

Object.keys(environment).forEach(function(variable) {
  debug(`${variable}: ${environment[variable]}`);
});

const app = express();

if (environment.logFormat) {
  app.use(logger(environment.logFormat));
}

app.use('/healthcheck', function healthcheck(req, res) {
  return res.status(200).json({
    status: 'success',
    data: {
      message: 'Healthcheck Ok'
    }
  });
});

app.set('env', environment.nodeEnv);
app.set('host', environment.host || 'localhost');
app.set('port', environment.port || 3000);
app.set('views', './lib/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/', express.static('./lib/static/homepage'));
app.use('/payments', express.static('./lib/static/payments'));
app.use('/errors', express.static('./node_modules/server-error-pages/_site'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(responseTime());
app.use(helmet());
app.use(compression());
app.use(middleware.sendEmails({
  mailgunApiKey: environment.mailgunApiKey,
  mailgunDomain: environment.mailgunDomain
}));

app.use(middleware.setGoogleTmId);
app.use('/payments', routes.payments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*jshint unused: consts*/
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(middleware.errorHandler);

module.exports = app;
