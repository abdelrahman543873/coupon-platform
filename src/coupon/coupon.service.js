import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  addCouponRepository,
  getCoupon,
  getMyCouponsRepository,
  updateCouponById,
} from "./coupon.repository.js";

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
