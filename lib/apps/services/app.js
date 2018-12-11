const debug = require('debug')('freelancer:lib:apps:services:app');
const serveStatic = require('serve-static');
const express = require('express');
const path = require('path');

const middleware = require('./middleware');
const environment = require('./environment');
const routes = require('./routes');

const app = express();

app.use(serveStatic(path.join(process.cwd(), 'public/services/landing')));
app.use(serveStatic(path.join(process.cwd(), 'static/services/landing')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'public/services/payments')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'static/services/payments')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use('/payments', routes);

module.exports = app;
