//the unnecessary paramter here are for the sake of the controller
const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  const message = err.message ? err.message : err;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode || 500;
    this.message = message || "server error";
  }
}
export { ErrorHandler, handleError };
