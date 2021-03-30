import { BaseHttpError } from "./error-handling-module/error-handler.js";

const ValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) throw new BaseHttpError(400, error.details[0].message);
    next();
  };
};
export { ValidationMiddleware };
