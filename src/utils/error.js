const STATUS_BAD_REQUEST = 400;
const STATUS_INTERNAL_SERVER_ERROR = 500;

/* eslint-disable no-param-reassign */
const makeErrorOperational = (err, status = STATUS_BAD_REQUEST) => {
  err.status = status;
  err.operational = true;
  return err;
};

const asyncErrorDecorator = fnc => (req, res, next) => {
  fnc(req, res, next).catch(err => next(makeErrorOperational(err)));
};

module.exports = {
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  makeErrorOperational,
  asyncErrorDecorator,
};
