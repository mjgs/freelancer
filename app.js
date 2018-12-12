#!/usr/bin/env node
const debug = require('debug')('freelancer:app');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const vhost = require('vhost');
const responseTime = require('response-time');
const serveStatic = require('serve-static');
const path = require('path');

const middleware = require('./lib/middleware');
const environment = require('./lib/environment');
const apps = require('./lib/apps');
const data = require('./lib/data');

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

app.set('view engine', 'ejs');
app.set('env', environment.env);
app.set('host', environment.host || 'localhost');
app.set('port', environment.port || 3000);
if (app.get('env') === 'production') {
  app.set('trust proxy', true);
}

app.use(helmet());
app.use(middleware.logRequest('main'));
app.use(responseTime());
app.use(compression());
app.use(serveStatic(path.join(process.cwd(), 'public/common')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(middleware.setGoogleTmId);
app.use(middleware.sendEmails({
  mailgunApiKey: environment.mailgunApiKey,
  mailgunDomain: environment.mailgunDomain
}));

Object.keys(apps).forEach(function(key) {
  debug(`Adding domain:${data.profile.domains[key]} --> app:${key}`);
  app.use(vhost(data.profile.domains[key], apps[key]));
});

app.use('/errors', express.static('./node_modules/server-error-pages/_site'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*jshint unused: consts*/
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

app.use(middleware.errorHandler);

module.exports = app;
