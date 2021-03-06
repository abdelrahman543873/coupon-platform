import jwt from "jsonwebtoken";
import { ProviderModel } from "../../provider/models/provider.model.js";
import { UserModel } from "../../user/models/user.model.js";
import { UserRoleEnum } from "../../user/user-role.enum.js";
import { BaseHttpError } from "../error-handling-module/error-handler.js";
import { CustomerModel } from "../../customer/models/customer.model.js";
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
    if (authenticatedUser.role === UserRoleEnum[0]) {
      if (!authenticatedUser.isVerified) throw new BaseHttpError(650);
      if (!authenticatedUser.isActive) throw new BaseHttpError(649);
    }
    if (authenticatedUser.role === UserRoleEnum[1]) {
      const customer = await CustomerModel.findOne({ user: user.id });
      if (!customer.isVerified) throw new BaseHttpError(648);
    }
    req.currentUser = authenticatedUser;
    req.lang = req?.headers?.lang;
    next();
  } catch (err) {
    next(err);
  }
};
