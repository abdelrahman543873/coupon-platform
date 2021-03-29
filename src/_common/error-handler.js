//the unnecessary paramter here are for the sake of the controller
const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
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
