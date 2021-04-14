import { findUserByEmailOrPhoneForLogin } from "../user/user.repository.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { getCustomerRepository } from "../customer/customer.repository.js";
import {
  findProviderByEmailForLogin,
  findProviderById,
} from "../provider/provider.repository.js";
import { generateToken } from "../utils/JWTHelper.js";

export const loginService = async (req, res, next) => {
  try {
    const user =
      (await findUserByEmailOrPhoneForLogin(req.body)) ||
      (await findProviderByEmailForLogin({ provider: req.body }));
    if (!user) throw new BaseHttpError(603);
    const passwordValidation = await bcryptCheckPass(
      req.body.password,
      user.password
    );
    if (!passwordValidation) throw new BaseHttpError(603);
    let data = { user: { ...user.toJSON() } };
    //if user is customer return user and customer data
    user.role === UserRoleEnum[1] &&
      (data = {
        user: { ...(await getCustomerRepository(user.id)), ...data.user },
      });
    delete data.password;
    return res.status(200).json({
      success: true,
      data: { ...data, authToken: generateToken(user._id, user.role) },
    });
  } catch (error) {
    next(error);
  }
};
