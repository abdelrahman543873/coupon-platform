import { NotificationModule } from "../CloudMessaging/module/notification.js";
import {
  addCouponRepository,
  findCouponByIdAndProvider,
  getMyCouponsRepository,
  updateCoupon,
  getCompletelySoldCouponsRepository,
  getCoupon,
  getNotCompletelySoldCouponsRepository,
} from "../coupon/coupon.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import {
  addVerificationCode,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import {
  findProviderByEmailForLogin,
  findProviderById,
  getProviders,
  providerRegisterRepository,
  updateProviderRepository,
} from "./provider.repository.js";
import { deleteCoupon } from "../coupon/coupon.repository.js";
import { findCategoryRepository } from "../category/category.repository.js";
import { findPointCities } from "../city/city.repository.js";
import { getRecentlySoldCouponsRepository } from "../../src/subscription/subscription.repository.js";
import { formattedGeo } from "../_common/helpers/geo-encoder.js";

export const providerRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findProviderByEmailForLogin({
      provider: req.body,
    });
    if (existingUser) throw new BaseHttpError(601);
    const provider = await providerRegisterRepository({
      role: UserRoleEnum[0],
      ...req.body,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: provider._id,
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
          ...(await findProviderById(provider._id)),
        },
        authToken: generateToken(provider._id, "PROVIDER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderService = async (req, res, next) => {
  try {
    const provider = await findProviderById(req.currentUser.id);
    return res.status(200).json({
      success: true,
      data: { provider },
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
    if (req.body.verificationCode) {
      const verification = await verifyOTPRepository({
        code: req.body.verificationCode,
        email: req.currentUser.email,
      });
      if (!verification) throw new BaseHttpError(617);
    }
    const provider = await updateProviderRepository(req.currentUser._id, {
      ...req.body,
      image: req.file,
    });
    return res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCouponsService = async (req, res, next) => {
  try {
    let data;
    req.query.recentlySold == "true" &&
      (data = await getRecentlySoldCouponsRepository(
        req.currentUser._id,
        req.query.offset,
        req.query.limit
      ));
    req.query.sold == "true" &&
      (data = await getCompletelySoldCouponsRepository(
        req.currentUser._id,
        req.query.offset,
        req.query.limit
      ));
    req.query.sold == "false" &&
      (data = await getNotCompletelySoldCouponsRepository(
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

export const addCouponService = async (req, res, next) => {
  try {
    const category = await findCategoryRepository(req.body.category);
    if (!category) throw new BaseHttpError(638);
    const coupon = await addCouponRepository({
      ...req.body,
      logoURL: req.file,
      provider: req.currentUser._id,
    });
    return res.status(200).json({
      success: true,
      data: await getCoupon({ _id: coupon.id }),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCouponService = async (req, res, next) => {
  try {
    const coupon = await findCouponByIdAndProvider(
      req.body.coupon,
      req.currentUser._id
    );
    if (!coupon) throw new BaseHttpError(618);
    const deletedCoupon = await deleteCoupon(coupon.id);
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCouponService = async (req, res, next) => {
  try {
    const coupon = await findCouponByIdAndProvider(
      req.body.coupon,
      req.currentUser._id
    );
    if (!coupon) throw new BaseHttpError(618);
    const updatedCoupon = await updateCoupon(coupon._id, req.currentUser._id, {
      ...req.body,
      logoURL: req.file,
    });
    res.status(200).json({
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getProvidersService = async (req, res, next) => {
  try {
    const providers = await getProviders(req.query.offset, req.query.limit);
    res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const addLocationService = async (req, res, next) => {
  try {
    const city = await findPointCities([req.body.long, req.body.lat]);
    if (city.length === 0) throw new BaseHttpError(639);
    // to allow the same function to work for both admin and provider
    const provider = await updateProviderRepository(
      req.body.provider || req.currentUser._id,
      {
        // created like this not to cause conflicts with locations value in the
        // model if it were to be place inside the updateProviderRepository
        // when expanding the object
        $addToSet: {
          "locations.coordinates": [req.body.long, req.body.lat],
          metaData: await formattedGeo({
            lat: req.body.lat,
            lon: req.body.long,
          }),
        },
      }
    );
    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};
