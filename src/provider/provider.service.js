import { NotificationModule } from "../CloudMessaging/module/notification.js";
import {
  getMyCouponsRepository,
  getProviderHomeRepository,
} from "../coupon/coupon.repository.js";
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
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ role: UserRoleEnum[0], ...req.body });
    const provider = await providerRegisterRepository({
      _id: user._id,
      ...req.body,
    });
    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider._id,
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

export const getMyCouponsService = async (req, res, next) => {
  try {
    const coupons = await getMyCouponsRepository(
      req.currentUser._id,
      req.query.categoryId,
      req.query.offset,
      req.query.limit
    );
    return res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderHomeService = async (req, res, next) => {
  const home = await getProviderHomeRepository(req.currentUser._id);
  return res.status(200).json({
    success: true,
    data: home,
  });
};
