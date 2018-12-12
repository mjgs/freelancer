const debug = require('debug')('freelancer:lib:apps:services:app');
const serveStatic = require('serve-static');
const express = require('express');
const path = require('path');

const middlewareMain = require('../../middleware');
const middleware = require('./middleware');
const environment = require('./environment');
const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(middlewareMain.logRequest('services'));
app.use(serveStatic(path.join(process.cwd(), 'public/apps/services/static/landing')));
app.use(serveStatic(path.join(process.cwd(), 'public/apps/services/custom/landing')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'public/apps/services/static/payments')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'public/apps/services/custom/payments')));
app.use('/payments', routes);

module.exports = app;
