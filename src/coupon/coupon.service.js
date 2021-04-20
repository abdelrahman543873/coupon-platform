import { findProviderById } from "../provider/provider.repository.js";
import { findUserByEmailOrPhone, updateUser } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  addCouponRepository,
  getCoupon,
  getMyCouponsRepository,
  updateCouponById,
  getAdminSubscriptionsRepository,
  getSubscriptionRepository,
} from "./coupon.repository.js";
import mongoose from "mongoose";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { findCategoryRepository } from "../category/category.repository.js";
import { verifyOTPRepository } from "../verification/verification.repository.js";

export const adminAddCouponService = async (req, res, next) => {
  try {
    const category = await findCategoryRepository(req.body.category);
    if (!category) throw new BaseHttpError(638);
    const coupon = await addCouponRepository({
      ...req.body,
      logoURL: req.file,
    });
    return res.status(200).json({
      success: true,
      data: await getCoupon({ _id: coupon.id }),
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCouponService = async (req, res, next) => {
  try {
    const coupon = await getCoupon({ _id: req.body.coupon });
    if (!coupon) throw new BaseHttpError(618);
    const updatedCoupon = await updateCouponById(coupon._id, {
      input: {
        ...req.body,
        logoURL: req.file,
      },
    });
    res.status(200).json({
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsService = async (req, res, next) => {
  try {
    const coupons = await getMyCouponsRepository(
      req.query.provider,
      req.query.category,
      req.query.offset,
      req.query.limit
    );
    return res.status(200).json({
      success: true,
      data: { coupons },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptionsService = async (req, res, next) => {
  try {
    const subscriptions = await getAdminSubscriptionsRepository(
      req.query.paymentType,
      req.query.provider,
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

export const getSubscriptionService = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.query.id))
      throw new BaseHttpError(631);
    const subscription = await getSubscriptionRepository({
      _id: req.query.id,
    });
    res.status(200).json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetProviderService = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.query.provider))
      throw new BaseHttpError(631);
    const provider = await findProviderById(req.query.provider);
    if (!provider) throw new BaseHttpError(611);
    res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateProfileService = async (req, res, next) => {
  try {
    const passwordValidation = req.body.password
      ? await bcryptCheckPass(req.body.password, req.currentUser.password)
      : true;
    if (!passwordValidation) throw new BaseHttpError(607);
    //if user wants to change email , there is going to be code and if this code isn't true an error will be thrown
    if (req.body.code) {
      const verification = await verifyOTPRepository({
        code: req.body.code,
      });
      if (!verification) throw new BaseHttpError(617);
      const user = findUserByEmailOrPhone({ email: verification.email });
      if (!user) throw new BaseHttpError(611);
    }
    //if user wants to change anything else
    const user = await updateUser(req.currentUser._id, req.body);
    return res.status(200).json({
      success: true,
      data: { user: { ...user.toJSON() } },
    });
  } catch (error) {
    next(error);
  }
};
