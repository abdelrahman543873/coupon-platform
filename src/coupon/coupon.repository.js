import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provier-customer-coupon.model.js";

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

export const getRecentlySoldCouponsRepository = async (
  providerId,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { providerId },
    { populate: "couponId", offset: offset * 10, limit, sort: "-createdAt" }
  );
};

export const getProviderHomeRepository = async (providerId) => {
  const numberOfSoldCoupons = await providerCustomerCouponModel
    .distinct("couponId", {
      providerId,
    })
    .countDocuments();

  const numberOfCoupons = await CouponModel.countDocuments({ providerId });
  return {
    numberOfSoldCoupons,
    numberOfCoupons,
    remainingCoupons: numberOfCoupons - numberOfSoldCoupons,
  };
};

export const addCouponRepository = async (coupon) => {
  return await CouponModel.create({
    ...coupon,
    ...(coupon.logoURL && { logoURL: coupon.logoURL.path }),
  });
};

export const rawDeleteCoupon = async () => {
  return await CouponModel.deleteMany({});
};
