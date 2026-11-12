export const errorHandler = (statusCode, code, message) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
};

export const notFound = (req, res, next) => {
  next(errorHandler(404, "NOT_FOUND", "Route not found."));
};

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || "INTERNAL_ERROR";
  let message = err.message || "Internal server error.";

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    statusCode = 409;
    code = `DUPLICATE_${field.toUpperCase()}`;
    message = `This ${field} is already taken.`;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    code = "INVALID_ID";
    message = "Invalid identifier.";
  }

  if (statusCode === 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Internal server error.";
      code = "INTERNAL_ERROR";
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    code,
    message,
    ...(err.details && { details: err.details }),
  });
};
