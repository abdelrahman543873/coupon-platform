import { findProviderByUserId } from "../provider/provider.repository.js";
import { findUserById, updateUser } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  addCouponRepository,
  getCoupon,
  getMyCouponsRepository,
  updateCouponById,
  getAdminSubscriptionsRepository,
} from "./coupon.repository.js";
import mongoose from "mongoose";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
export const adminAddCouponService = async (req, res, next) => {
  try {
    const coupon = await addCouponRepository({
      ...req.body,
      logoURL: req.file,
    });
    return res.status(200).json({
      success: true,
      data: coupon,
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
      req.query.provider,
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetProviderService = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.query.provider))
      throw new BaseHttpError(631);
    const user = await findUserById(req.query.provider);
    if (!user) throw new BaseHttpError(611);
    const provider = await findProviderByUserId(req.query.provider);
    res.status(200).json({
      success: true,
      data: { user: { ...user, ...provider } },
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
    const user = await updateUser(req.currentUser._id, req.body);
    return res.status(200).json({
      success: true,
      data: { user: { ...user.toJSON() } },
    });
  } catch (error) {
    next(error);
  }
};
