#!/usr/bin/env node
const debug = require('debug')('freelancer:lib:server:app');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const vhost = require('vhost');
const responseTime = require('response-time');
const serveStatic = require('serve-static');
const path = require('path');

const middleware = require('./middleware');
const environment = require('./environment');
const data = require('./data');
const apps = require('../apps');

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('env', environment.env);
app.set('host', environment.host || 'localhost');
app.set('port', environment.port || 3000);
if (app.get('env') === 'production') {
  app.set('trust proxy', true);
}

app.use(helmet());
app.use(middleware.addEnvironment);
app.use(middleware.addUtils);
app.use(middleware.logRequest);
app.use(responseTime());
app.use(compression());
app.use(serveStatic(path.join(process.cwd(), 'public/common')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(middleware.setGoogleTmId);

Object.keys(data.domains).forEach(function(appName) {
  const domain = data.domains[appName];
  debug(`Adding vhost: ${domain} --> ${appName}`);
  app.use(vhost(domain, apps[appName]));
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
