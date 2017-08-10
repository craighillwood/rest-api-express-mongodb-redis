const uuidv4 = require('uuid/v4');
const logger = require('../utils/logger');

const middleware = (req, res, next) => {
  req.id = uuidv4();
  // logger.info(`Request id: ${req.id}`);
  logger.info('create-request-id', { id: req.id });
  next();
};

module.exports = middleware;
