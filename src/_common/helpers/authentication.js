import jwt from "jsonwebtoken";
import { ProviderModel } from "../../provider/models/provider.model.js";
import { UserModel } from "../../user/models/user.model.js";
import { BaseHttpError } from "../error-handling-module/error-handler.js";
export const authenticationMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new BaseHttpError(606);
    const token = auth.replace("Bearer ", "");
    let user;
    let verificationError;
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      // only way to throw an error from inside verify token
      if (error) verificationError = true;
      if (decoded) user = decoded;
    });
    if (verificationError) throw new BaseHttpError(613);
    const authenticatedUser =
      (await UserModel.findById(user.id)) ||
      (await ProviderModel.findById(user.id));
    if (!authenticatedUser) throw new BaseHttpError(614);
    req.currentUser = authenticatedUser;
    next();
  } catch (err) {
    next(err);
  }
};
