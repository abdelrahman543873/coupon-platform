import { nanoid } from "nanoid";
import { provider } from "../provider/models/provider.model.js";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provier-customer-coupon.model.js";

export const getMyCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    {
      provider,
      isActive: true,
      ...(category && { category }),
    },
    { offset: offset * 10, limit, sort: "-createdAt" }
  );
};

export const getRecentlySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { ...(provider && { provider }) },
    { populate: "coupon", offset: offset * 10, limit, sort: "-createdAt" }
  );
};

export const getRecentlyAdddedCouponsRepository = async (
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    {},
    { populate: "coupon", offset: offset * 10, limit, sort: "-createdAt" }
  );
};

export const getMostSellingCouponRepository = async (
  offset = 0,
  limit = 15
) => {
  //pagination with aggregation to be modified and improved
  return await providerCustomerCouponModel.aggregate([
    {
      $sortByCount: "$coupon",
    },
    {
      $lookup: {
        from: CouponModel.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $unwind: "$coupon",
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        docs: [{ $skip: offset }, { $limit: limit }],
      },
    },
    {
      $project: {
        docs: 1,
        totalDocs: { $arrayElemAt: ["$metadata.total", 0] },
      },
    },
  ]);
};
export const getProviderHomeRepository = async (provider) => {
  const numberOfSoldCoupons = await providerCustomerCouponModel
    .distinct("coupon", {
      provider,
    })
    .countDocuments();

  const numberOfCoupons = await CouponModel.countDocuments({ provider });
  return {
    numberOfSoldCoupons,
    numberOfCoupons,
    remainingCoupons: numberOfCoupons - numberOfSoldCoupons,
  };
};

export const addCouponRepository = async (coupon) => {
  return await CouponModel.create({
    ...coupon,
    code: nanoid(),
    ...(coupon.logoURL && { logoURL: coupon.logoURL.path }),
  });
};

export const rawDeleteCoupon = async () => {
  return await CouponModel.deleteMany({});
};

export const rawDeleteProviderCustomerCoupon = async () => {
  return await providerCustomerCouponModel.deleteMany({});
};
