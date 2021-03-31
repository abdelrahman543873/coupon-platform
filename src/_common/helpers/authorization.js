import { BaseHttpError } from "../error-handling-module/error-handler.js";
export const authorizationMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      if (req.currentUser.role !== role) throw new BaseHttpError(608);
      next();
    } catch (err) {
      next(err);
    }
  };
};
