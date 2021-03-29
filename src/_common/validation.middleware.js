import { ErrorHandler } from "./error-handler.js";

const ValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) throw new ErrorHandler(400, error.details[0].message);
    next();
  };
};
export { ValidationMiddleware };
