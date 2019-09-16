const debug = require('debug')('freelancer:lib:apps:services:app');
const serveStatic = require('serve-static');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');

const environment = require('./environment');
const middleware = require('./middleware');
const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(middleware.addEnvironment);
app.use(middleware.addUtils);
app.use(middleware.logRequest);
app.use(middleware.sendEmails({
  mailgunApiKey: environment.mailgunApiKey,
  mailgunDomain: environment.mailgunDomain
}));
app.use(expressSession({
  secret: environment.sessionsSecretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: environment.enableSesionsSecureCookies }
}));

if (environment.env === 'production') {
  app.set('trust proxy', true);
}

app.use('/', serveStatic(path.join(process.cwd(), 'public/apps/services/custom')));
app.use('/', serveStatic(path.join(process.cwd(), 'public/apps/services/static')));
app.use('/', routes);

app.use(middleware.errorHandler);

module.exports = app;
