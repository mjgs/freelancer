const debug = require('debug')('freelancer:lib:apps:services:app');
const serveStatic = require('serve-static');
const express = require('express');
const path = require('path');

const middlewareMain = require('../../middleware');
const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(middlewareMain.logRequest('services'));
app.use('/', serveStatic(path.join(process.cwd(), 'public/apps/services/custom')));
app.use('/', serveStatic(path.join(process.cwd(), 'public/apps/services/static')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'public/apps/services/custom')));
app.use('/payments', serveStatic(path.join(process.cwd(), 'public/apps/services/static')));
app.use('/payments', routes);

module.exports = app;
