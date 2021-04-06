import { NotificationModule } from "../CloudMessaging/module/notification.js";
import {
  addCouponRepository,
  getMyCouponsRepository,
  getProviderHomeRepository,
  getRecentlySoldCouponsRepository,
} from "../coupon/coupon.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import {
  createUser,
  findUserByEmailOrPhone,
  updateUser,
} from "../user/user.repository.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import { addVerificationCode } from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
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
      user: user.id,
      ...req.body,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: user._id,
    });
    await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider._id,
    });
    return res.status(201).json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          ...provider.toJSON(),
          code: verificationCode.code,
          // this is done so the api user won't be confused between the User property of the provider and
          // the id of the provider
          _id: provider.user,
        },
        authToken: generateToken(user._id, "PROVIDER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderService = async (req, res, next) => {
  try {
    const provider = await findProviderByUserId(req.currentUser.id);
    return res.status(200).json({
      success: true,
      data: provider,
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
    const provider = await updateProviderRepository(req.currentUser._id, {
      ...req.body,
      logoURL: req.file,
    });
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
    let data;
    req.query.recentlySold &&
      (data = await getRecentlySoldCouponsRepository(
        req.currentUser._id,
        req.query.offset,
        req.query.limit
      ));
    !data &&
      (data = await getMyCouponsRepository(
        req.currentUser._id,
        req.query.categoryId,
        req.query.offset,
        req.query.limit
      ));
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderHomeService = async (req, res, next) => {
  try {
    const home = await getProviderHomeRepository(req.currentUser._id);
    return res.status(200).json({
      success: true,
      data: home,
    });
  } catch (error) {
    next(error);
  }
};

export const addCouponService = async (req, res, next) => {
  try {
    const coupon = await addCouponRepository({
      ...req.body,
      logoURL: req.file,
      provider: req.currentUser._id,
    });
    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};
