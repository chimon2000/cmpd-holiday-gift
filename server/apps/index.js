// @flow
/*eslint no-console: "off"*/

const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const compression = require('compression');
const { join } = require('path');
const express = require('express');
const path = require('path');

const config = require('../config');

const models = require('../models');
const nominations = require('./nominations');
const authApp = require('./auth');
const logger = require('./lib/logger');

import type { $Application } from 'express';

const app = express();

// Log to file
if (config.enableAccessLog) {
  app.use(morgan('combined', {
    stream: (fs.createWriteStream(
      join(config.run, 'access.log'),
      { flags: 'a' }): any)
  }));
}

// Log to stdout for development
if (config.verboseAccessLog) {
  app.use(morgan('dev'));
}

// Compress contents
if (config.useCompression) {
  app.use(compression());
}

// TODO: handle and log errors

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../../react-ui/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mount the apps
app.use('/api/nominations', nominations);
app.use('/api/auth', authApp);

// app.get((_req: *, res: *, _next: *): * => {
//   res.sendFile(join(__dirname, '../../build/index.html'));
// });

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});

// Array of promises that must complete before starting the server
const initialize = [];

// Sync the database
initialize.push(models.sync().then(function () {
  if (config.verbose) {
    logger.info('Nice! Database sync succeeded.');
  }
}).catch(function (err) {
  logger.info('Database sync failed:', err);
}));

// Prepare to compile the views and web assets

module.exports = (Promise.all(initialize).then(() => app): Promise<$Application>);
