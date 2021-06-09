import { LocalizedErrorMessages } from "./error-messages.js";
//the unnecessary paramter here are for the sake of the controller
const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode < 600
      ? err
      : getLocalizedMessage(err.statusCode, req?.lang?.toUpperCase());
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

const getLocalizedMessage = (int, lang = "AR") => {
  const message = LocalizedErrorMessages[int][lang];
  if (!message) throw new BaseHttpError(605);
  return message;
};

class BaseHttpError extends Error {
  constructor(statusCode) {
    super();
    this.statusCode = statusCode || 500;
  }
}
export { BaseHttpError, handleError };
