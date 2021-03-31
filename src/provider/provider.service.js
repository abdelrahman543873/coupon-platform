import { NotificationModule } from "../CloudMessaging/module/notification.js";
import { user } from "../user/models/user.model.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import {
  createUser,
  findUserByEmailOrPhone,
  updateUser,
} from "../user/user.repository.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  findProviderByUserId,
  providerRegisterRepository,
  updateProviderRepository,
} from "./provider.repository.js";

export const providerRegisterService = async (req, res, next) => {
  try {
    const user = await createUser({ role: UserRoleEnum[0], ...req.body });
    const provider = await providerRegisterRepository({
      userId: user.id,
      ...req.body,
    });
    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider.id,
    });

    return res.status(201).json({
      success: true,
      data: {
        user: { ...user.toJSON(), ...provider.toJSON() },
        authToken: generateToken(user._id, "PROVIDER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderService = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: req.currentUser });
  } catch (error) {
    next(error);
  }
};

export const providerLoginService = async (req, res, next) => {
  try {
    const user = await findUserByEmailOrPhone(req.body);
    if (!user) throw new BaseHttpError(603);
    const passwordValidation = await bcryptCheckPass(
      req.body.password,
      user.password
    );
    if (!passwordValidation) throw new BaseHttpError(603);
    const provider = await findProviderByUserId(user._id);
    return res.status(200).json({
      success: true,
      data: {
        ...user.toJSON(),
        ...provider.toJSON(),
        authToken: generateToken(user._id, "PROVIDER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderService = async (req, res, next) => {
  try {
    const passwordValidation = req.body.password
      ? await bcryptCheckPass(req.body.password, req.currentUser.password)
      : true;
    if (!passwordValidation) throw new BaseHttpError(607);
    const user = await updateUser(req.currentUser._id, req.body);
    const provider = await updateProviderRepository(
      req.currentUser._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: { ...user.toJSON(), ...provider.toJSON() },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
