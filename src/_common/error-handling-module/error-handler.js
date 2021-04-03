import { LocalizedErrorMessages } from "./error-messages.js";
//the unnecessary paramter here are for the sake of the controller
const handleError = (err, req, res, next) => {
  // console.log(err);
  const statusCode = err.statusCode ? err.statusCode : 500;
  const message = err.message ? err.message : err;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

const getLocalizedMessage = (int, lang = "EN") => {
  const message = LocalizedErrorMessages[int][lang];
  if (!message) throw new BaseHttpError(605);
  return message;
};

class BaseHttpError extends Error {
  constructor(statusCode, message, lang = "EN") {
    super();
    this.statusCode = statusCode || 500;
    this.message = message || getLocalizedMessage(this.statusCode, lang);
  }
}
export { BaseHttpError, handleError };
