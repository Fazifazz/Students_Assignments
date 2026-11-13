function errorHandler(error, req, res, next) {
  const errorStatus = Number.isInteger(error.statusCode) ? error.statusCode : error.status;
  const statusCode = Number.isInteger(errorStatus) && errorStatus >= 400 && errorStatus < 600
    ? errorStatus
    : 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = errorHandler;
