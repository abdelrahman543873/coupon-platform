import { nanoid } from "nanoid";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provider-customer-coupon.model.js";

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

export const getSubscriptionsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { provider },
    {
      populate: "coupon customer",
      offset: offset * 10,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getCustomerSubscriptionsRepository = async (
  customer,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { customer },
    {
      populate: "coupon provider",
      offset: offset * 10,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getSubscriptionRepository = async ({
  _id,
  provider,
  customer,
}) => {
  return await providerCustomerCouponModel.findOne(
    {
      ...(_id && { _id }),
      ...(provider && { provider }),
      ...(customer && { customer }),
    },
    {},
    {
      populate: "coupon customer provider",
    }
  );
};

export const getCustomerSubscriptionRepository = async (_id, customer) => {
  return await providerCustomerCouponModel.findOne(
    { _id, provider },
    {},
    {
      populate: "coupon customer",
    }
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

export const findCouponByIdAndProvider = async (_id, provider) => {
  return await CouponModel.findOne({ _id, provider });
};

export const updateCoupon = async (_id, provider, input) => {
  return await CouponModel.findOneAndUpdate(
    { _id, provider },
    { ...input, ...(input.logoURL && { logoURL: input.logoURL.path }) },
    { new: true, omitUndefined: true }
  );
};

export const deleteCoupon = async (_id) => {
  return await CouponModel.deleteOne({ _id });
};

export const rawDeleteCoupon = async () => {
  return await CouponModel.deleteMany({});
};

export const rawDeleteProviderCustomerCoupon = async () => {
  return await providerCustomerCouponModel.deleteMany({});
};

export const searchCouponsRepository = async (name, offset = 0, limit = 15) => {
  return await CouponModel.paginate(
    {
      $or: [
        { enName: { $regex: name, $options: "i" } },
        { arName: { $regex: name, $options: "i" } },
      ],
    },
    { limit, offset }
  );
};

export const getCoupon = async ({ _id }) => {
  return await CouponModel.findOne({ _id }, {}, { lean: true });
};

export const findCoupons = async (ids) => {
  return await CouponModel.find({ _id: { $in: ids } });
};

export const findProviderCouponsRepository = async (provider) => {
  return await CouponModel.find({ provider }, {}, { lean: true });
};

export const markCouponUsedRepository = async ({ coupon, customer }) => {
  return await providerCustomerCouponModel.findOneAndUpdate(
    { customer, coupon },
    { isUsed: true },
    { new: true }
  );
};

export const updateCouponsRepository = async ({ ids, value }) => {
  return await CouponModel.updateMany({ _id: { $in: ids } }, value);
};
