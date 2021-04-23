import { BaseHttpError } from "./error-handling-module/error-handler.js";
export const ValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate({ ...req.body, ...req.query });
      if (error) throw new BaseHttpError(400, error.details[0].message);
      next();
    } catch (error) {
      next(error);
    }
  };
};
