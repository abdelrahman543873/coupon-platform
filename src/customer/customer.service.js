import { getCategories } from "../category/category.repository.js";
import {
  getMostSellingCouponRepository,
  getRecentlyAdddedCouponsRepository,
  getCustomerSubscriptionsRepository,
} from "../coupon/coupon.repository.js";
import { getProviders } from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { generateToken } from "../utils/JWTHelper.js";
import {
  addVerificationCode,
  resendCodeRepository,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import {
  CustomerRegisterRepository,
  getCustomerBySocialLoginRepository,
  getCustomerRepository,
} from "./customer.repository.js";

export const CustomerRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ ...req.body, role: UserRoleEnum[1] });
    const customer = await CustomerRegisterRepository({
      user: user._id,
      ...req.body,
      profilePictureURL: req.file,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: user._id,
    });
    const code = await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    res.status(201).json({
      success: true,
      data: {
        user: { ...user.toJSON(), ...customer.toJSON() },
        authToken: generateToken(user._id, "CUSTOMER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerService = async (req, res, next) => {
  try {
    const customer = await getCustomerRepository(req.currentUser._id);

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const socialLoginService = async (req, res, next) => {
  try {
    const customer = await getCustomerBySocialLoginRepository(
      req.body.socialMediaId
    );
    if (!customer) throw new BaseHttpError(611);
    if (!customer.isVerified) throw new BaseHttpError(612);
    res.status(200).json({
      success: true,
      data: { ...customer.toJSON(), auth: generateToken(customer.user.id) },
    });
  } catch (error) {
    next(error);
  }
};

export const socialRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({
      ...req.body,
      role: UserRoleEnum[1],
    });
    const customer = await CustomerRegisterRepository({
      user: user.id,
      ...req.body,
      profilePictureURL: req.file,
    });
    res.status(201).json({
      success: true,
      data: {
        ...user.toJSON(),
        ...customer.toJSON(),
        authToken: generateToken(user.id, "CLIENT"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerHomeService = async (req, res, next) => {
  try {
    const categories = await getCategories(req.query.offset, req.query.limit);
    const providers = await getProviders(req.query.offset, req.query.limit);
    res.status(200).json({
      data: {
        categories,
        providers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomersCouponsService = async (req, res, next) => {
  try {
    if (req.query.section !== "newest" && req.query.section !== "bestSeller")
      throw new BaseHttpError(616);
    let data;
    req.query.section === "newest" &&
      (data = await getRecentlyAdddedCouponsRepository(
        req.query.providerId,
        req.query.offset,
        req.query.limit
      ));
    !data &&
      (data = (
        await getMostSellingCouponRepository(req.query.offset, req.query.limit)
      )[0]);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTPService = async (req, res, next) => {
  try {
    const code = await verifyOTPRepository(req.currentUser._id, req.body.code);
    if (!code) throw new BaseHttpError(617);
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const resendCodeService = async (req, res, next) => {
  try {
    let verification = await resendCodeRepository(req.currentUser._id);
    verification
      ? verification
      : await addVerificationCode({
          ...createVerificationCode(),
          user: req.currentUser._id,
        });
    await sendMessage({
      to: req.body.phone,
      text: verification.code,
    });
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerSubscriptionsService = async (req, res, next) => {
  try {
    const subscriptions = await getCustomerSubscriptionsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
