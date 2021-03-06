import { getCategories } from "../category/category.repository.js";
import {
  getRecentlyAdddedCouponsRepository,
  getCoupon,
  findCoupons,
} from "../coupon/coupon.repository.js";
import { getProviders } from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import {
  createUser,
  findUserByEmailOrPhone,
  updateUser,
} from "../user/user.repository.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import {
  addVerificationCode,
  resendCodeRepository,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import {
  addFavCouponRepository,
  removeFavCouponRepository,
  addFavCouponsRepository,
  CustomerRegisterRepository,
  getCustomerBySocialLoginRepository,
  getCustomerFavCoupons,
  getCustomerRepository,
  updateCustomerRepository,
} from "./customer.repository.js";
import mongoose from "mongoose";
import {
  getCustomerSubscriptionRepository,
  getMostSellingCouponRepository,
} from "../subscription/subscription.repository.js";
import { bcryptCheckPass } from "../_common/helpers/bcryptHelper.js";

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
    await sendMessage({
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
    // restore this
    // if (!customer.isVerified) throw new BaseHttpError(612);
    const data = {
      ...customer,
      ...customer.user,
    };
    // fix this
    delete data.user;
    res.status(200).json({
      success: true,
      data: {
        user: { ...data },
        authToken: generateToken(customer.user._id),
      },
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
      isVerified: true,
      isSocialMediaVerified: true,
    });
    const data = {
      ...user.toJSON(),
      ...customer.toJSON(),
    };
    //modify this
    delete data.user;
    res.status(201).json({
      success: true,
      data: {
        user: { ...data },
        authToken: generateToken(user._id, "CLIENT"),
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
    let data;
    req.query.section === "bestSeller" &&
      (data = await getMostSellingCouponRepository(
        req.query.category,
        req.query.offset,
        req.query.limit,
        req.query.provider,
        req.currentUser
      ));
    !data &&
      (data = await getRecentlyAdddedCouponsRepository(
        req.query.provider,
        req.query.category,
        req.query.offset,
        req.query.limit,
        req.currentUser
      ));
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
    const code = await verifyOTPRepository({
      user: req.currentUser._id,
      code: req.body.code,
    });
    if (!code) throw new BaseHttpError(617);
    const updatedCustomer = await updateCustomerRepository(
      req.currentUser._id,
      {
        isVerified: true,
      }
    );
    res.status(200).json({
      success: true,
      data: {
        user: {
          ...updatedCustomer,
          ...req.currentUser.toJSON(),
        },
        authToken: generateToken(req.currentUser._id, req.currentUser.role),
      },
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

export const toggleFavCouponService = async (req, res, next) => {
  try {
    const favCoupons = (
      await getCustomerRepository(req.currentUser._id)
    ).favCoupons.map((coupon) => {
      return coupon.toString();
    });
    const exists = favCoupons.includes(req.body.coupon);
    exists
      ? await removeFavCouponRepository({
          user: req.currentUser._id,
          couponId: req.body.coupon,
        })
      : await addFavCouponRepository({
          user: req.currentUser._id,
          couponId: req.body.coupon,
        });
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavCouponsService = async (req, res, next) => {
  try {
    const favCoupons = await getCustomerFavCoupons(req.currentUser._id);
    res.status(200).json({
      success: true,
      data: favCoupons,
    });
  } catch (error) {
    next(error);
  }
};

export const syncCouponsService = async (req, res, next) => {
  try {
    const coupons = await findCoupons(req.body.coupons);
    if (coupons.length !== req.body.coupons.length)
      throw new BaseHttpError(622);
    const customer = await addFavCouponsRepository({
      user: req.currentUser._id,
      coupons: req.body.coupons,
    });
    res.status(200).json({
      success: true,
      data: customer.favCoupons,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponService = async (req, res, next) => {
  try {
    const coupon = await getCoupon({
      _id: req.query.coupon,
      user: req.currentUser?._id,
    });
    if (!coupon) throw new BaseHttpError(621);
    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerService = async (req, res, next) => {
  try {
    const passwordValidation = req.body.password
      ? await bcryptCheckPass(req.body.password, req.currentUser.password)
      : true;
    if (!passwordValidation) throw new BaseHttpError(607);
    if (req.body.code) {
      const verification = await verifyOTPRepository({
        code: req.body.code,
        ...(req.currentUser.phone && { phone: req.currentUser.phone }),
        ...(req.currentUser.email && { email: req.currentUser.email }),
      });
      if (!verification) throw new BaseHttpError(617);
    }
    const user = await updateUser(req.currentUser._id, req.body);
    const customer = await updateCustomerRepository(req.currentUser._id, {
      ...req.body,
      profilePictureURL: req.file,
    });
    return res.status(200).json({
      success: true,
      data: { user: { ...customer, ...user.toJSON() } },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerSubscriptionService = async (req, res, next) => {
  try {
    if (req.query.coupon && !mongoose.Types.ObjectId.isValid(req.query.coupon))
      throw new BaseHttpError(631);
    if (
      req.query.provider &&
      !mongoose.Types.ObjectId.isValid(req.query.provider)
    )
      throw new BaseHttpError(631);
    const subscription = await getCustomerSubscriptionRepository({
      _id: req.query.subscription,
      coupon: req.query.coupon,
      customer: req.currentUser._id,
      provider: req.query.provider,
    });
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const changePhoneService = async (req, res, next) => {
  try {
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: req.currentUser._id,
      ...(req.currentUser.phone && { phone: req.currentUser.phone }),
      ...(req.currentUser.email && { email: req.currentUser.email }),
    });
    await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    const response = {
      ...req.currentUser.toJSON(),
      ...(await getCustomerRepository(req.currentUser._id)),
    };
    delete response.password;
    res.status(200).json({
      success: true,
      data: {
        user: response,
      },
    });
  } catch (error) {
    next(error);
  }
};
