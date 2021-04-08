import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { generateToken } from "../utils/JWTHelper.js";

export const getAdminTokenService = async (req, res, next) => {
  try {
    const user = await userFactory({ role: UserRoleEnum[2] });
    res.status(200).json({
      data: user,
      authToken: generateToken(user.id, "ADMIN"),
    });
  } catch (error) {
    next(error);
  }
};
