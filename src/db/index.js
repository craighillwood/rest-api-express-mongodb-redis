const { DB_URL } = require('../app/config');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.Promise = global.Promise;

let connected = false;
const loggerDispatcher = 'Database';

const init = () => {
  mongoose.connection.once('open', () => {
    logger.info('open', { dispatcher: loggerDispatcher });

    mongoose.connection.on('connected', () => {
      connected = true;
      logger.info('connected', { dispatcher: loggerDispatcher });
    });

    mongoose.connection.on('disconnected', () => {
      connected = false;
      logger.warn('disconnected', { dispatcher: loggerDispatcher });
    });

    mongoose.connection.on('reconnected', () => {
      logger.warn('reconnected', { dispatcher: loggerDispatcher });
    });

    mongoose.connection.on('error', err => {
      connected = false;
      logger.error(err, { dispatcher: loggerDispatcher, from: 'error event' });
    });
  });

  mongoose
    .connect(DB_URL)
    .then(() => {
      connected = true;
      logger.info('connected', { dispatcher: loggerDispatcher });
    })
    .catch(err => logger.error(err, { dispatcher: loggerDispatcher, from: 'catch' }));
};

module.exports = {
  get connected() {
    return connected;
  },
  init,
};
