const customErrorHandler = (error,next) => {
  console.log(error.details)
  if (error.code && error.details) {
    return next({
      message: error.details || error.message,
      code: error.code || 500,
    });
  }

  return next({
    message: error.message || "Failed to perform operation",
    code: 500,
  });
};

module.exports = customErrorHandler;