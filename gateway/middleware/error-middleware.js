const grpcErrorCodeMap = require("../errors/error-codes");

const errorMiddleWare = (err, req, res, next) => {
    
  let statusCode = err.code || 500;
  let message = err.message || "Failed to request";
  if (err.code <= 16) {
    const errorStatus = grpcErrorCodeMap[err.code];
    statusCode = errorStatus.httpStatus;
    message = errorStatus.message;
    return res
    .status(statusCode)
    .json({ message: message, success: false, details: err.message });
  }

  return res
    .status(statusCode)
    .json({ message: message, success: false });
};

module.exports = errorMiddleWare;
