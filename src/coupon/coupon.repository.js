import { CouponModel } from "./models/coupon.model.js";

export const getMyCouponsRepository = async (
  providerId,
  categoryId,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    {
      providerId,
      isActive: true,
      ...(categoryId && { categoryId }),
    },
    { offset: offset * 10, limit, sort: "-createdAt" }
  );
};

export const rawDeleteCoupon = async () => {
  return await CouponModel.deleteMany({});
};
