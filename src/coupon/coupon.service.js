import { addCouponRepository } from "./coupon.repository.js";

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
