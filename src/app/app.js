const { isTest, isProd } = require('./config');
const express = require('express');
const helmet = require('helmet');
const { makeErrorOperational, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/error');
const logger = require('../utils/logger');
const createRequestId = require('../middlewares/create-request-id');
const log = require('../middlewares/log');
const db = require('../db');
const usersRoute = require('../routes/users');

const loggerDispatcher = 'App';

if (isTest === false) {
  db.init();
}

const app = express();

app.use(createRequestId);
app.use(helmet());

if (isTest === false) {
  app.use([log.request, log.responseOk, log.responseError]);
  app.use((req, res, next) => {
    if (db.connected === false) {
      const err = new Error('Could not connect to the database');
      next(makeErrorOperational(err, STATUS_INTERNAL_SERVER_ERROR));
    } else {
      next();
    }
  });
}

// routes
app.use('/users', usersRoute);

// 404 error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  next(makeErrorOperational(err, 404));
});

// error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.log('last resort', err);
  const status = parseInt(err.status, 10) || STATUS_INTERNAL_SERVER_ERROR;
  const response = {
    status,
    message: err.message,
  };

  if (isProd === false) {
    response.error = err;
  }

  if (err.operational === true) {
    logger.warn(err, { dispatcher: loggerDispatcher, id: req.id });
    res.status(status).send(response);
  } else {
    logger.error(err, { dispatcher: loggerDispatcher, id: req.id }, () => {
      process.exit(1);
    });
  }
});

module.exports = app;
