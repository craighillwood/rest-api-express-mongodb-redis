const { LOG_LEVEL, LOG_TO_FILE, isTest } = require('../app/config');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
// require('winston-daily-rotate-file');

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
const level = levels.find(x => x === LOG_LEVEL) || 'error';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      // json: true,
      timestamp: () => new Date().toISOString(),
    }),
  ],
});

logger.level = level;

if (LOG_TO_FILE === true && isTest === false) {
  const logsPath = path.resolve(__dirname, '../../logs');

  if (fs.existsSync(logsPath) === false) {
    fs.mkdirSync(logsPath);
  }

  logger.add(winston.transports.File, {
    name: 'error-file',
    level: 'error',
    stream: rfs('error.log', { interval: '1d', path: logsPath }),
  });

  logger.add(winston.transports.File, {
    name: 'warn-file',
    level: 'warn',
    stream: rfs('warn.log', { interval: '1d', path: logsPath }),
  });
}

if (isTest === true) {
  logger.remove(winston.transports.Console);
}

module.exports = logger;
