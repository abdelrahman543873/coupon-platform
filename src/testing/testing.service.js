import { UserRoleEnum } from "../user/user-role.enum.js";
import { buildUserParams, userFactory } from "../user/user.factory.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";

export const getAdminTokenService = async (req, res, next) => {
  try {
    const params = await buildUserParams({ role: UserRoleEnum[2] });
    const user = await userFactory(params);
    res.status(200).json({
      data: params,
      authToken: generateToken(user.id, "ADMIN"),
    });
  } catch (error) {
    next(error);
  }
};
