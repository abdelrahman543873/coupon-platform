import jwt from "jsonwebtoken";
import { UserModel } from "../../user/models/user.model.js";
import { BaseHttpError } from "../error-handling-module/error-handler.js";
export const authenticationMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new BaseHttpError(606);
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) throw new BaseHttpError(600);
    req.currentUser = await UserModel.findById(decoded.id);
    next();
  } catch (err) {
    next(err);
  }
};