import jwt from "jsonwebtoken";
import { ProviderModel } from "../../provider/models/provider.model.js";
import { UserModel } from "../../user/models/user.model.js";
import { BaseHttpError } from "../error-handling-module/error-handler.js";
export const semiAuthenticationMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      req.currentUser = null;
    } else {
      const token = auth.replace("Bearer ", "");
      let user;
      let verificationError;
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        // only way to throw an error from inside verify token
        if (error) verificationError = true;
        if (decoded) user = decoded;
      });
      if (verificationError) req.currentUser === null;
      else {
        const authenticatedUser =
          (await UserModel.findById(user.id)) ||
          (await ProviderModel.findById(user.id));
        if (!authenticatedUser) throw new BaseHttpError(614);
        req.currentUser = authenticatedUser;
      }
    }
    req.lang = req?.headers?.lang;
    next();
  } catch (err) {
    next(err);
  }
};
