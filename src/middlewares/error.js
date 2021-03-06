const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return message;
};

const handleDuplicateFieldsDB = (err) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value} already exists, Please use another value!`;
  return message;
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join('. ')}`;
  return message;
};
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (error.name === 'CastError') error.message = handleCastErrorDB(error);
  if (error.code === 11000) error.message = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error.message = handleValidationErrorDB(error);

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    status: err.status,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
