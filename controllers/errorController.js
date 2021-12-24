const AppError = require("../utils/appError");

//JWT errors
const handleJWTError = () => new AppError('Invalid token', 401);
const handleJWTExpiredError = () => new AppError('Token is expired', 401);

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.error).map(el=>el.message);
  const message = `Invalid input data ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) =>
  res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message, stack: err.stack });

const sendErrorProd = (err, res) => {
  if (err.isOperational)
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  else {
    console.error("Error", err);
    res.status(500).json({ status: "error", message: "Someting went wrong" });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === "11000") error = handleDuplicateFieldsDB(error);
    if (err.code === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
