import {
  findProviderByUserId,
  manageProviderStatusRepository,
} from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";

export const addAdminService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ ...req.body, role: UserRoleEnum[2] });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const manageProviderStatusService = async (req, res, next) => {
  try {
    const provider = await findProviderByUserId(req.body.provider);
    if (!provider) throw new BaseHttpError(617);
    const updatedProvider = await manageProviderStatusRepository(
      provider.user._id,
      !provider.isActive
    );
    res.status(200).json({
      success: true,
      data: updatedProvider.isActive,
    });
  } catch (error) {
    next(error);
  }
};
