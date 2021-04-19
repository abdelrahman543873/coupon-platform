import { nanoid } from "nanoid";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provider-customer-coupon.model.js";
import dotenv from "dotenv";
import { ProviderModel } from "../provider/models/provider.model.js";
import { CategoryModel } from "../category/models/category.model.js";
import mongoose from "mongoose";
import { CustomerModel } from "../customer/models/customer.model.js";
import { PaymentModel } from "../payment/models/payment.model.js";
import { UserModel } from "../user/models/user.model.js";

dotenv.config();
export const getMyCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    {
      ...(category && { category }),
      ...(provider && { provider }),
      isActive: true,
    },
    {
      offset: offset * limit,
      limit,
      sort: "-createdAt",
      populate: [
        { path: "provider", select: { password: 0 } },
        { path: "category" },
      ],
    }
  );
};

export const getRecentlySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { ...(provider && { provider }) },
    { populate: "coupon", offset: offset * limit, limit, sort: "-createdAt" }
  );
};
export const getCompletelySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    { ...(provider && { provider }), amount: 0 },
    { populate: "coupon", offset: offset * limit, limit, sort: "-createdAt" }
  );
};

export const getSubscriptionsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { ...(provider && { provider }) },
    {
      populate: [
        { path: "customer", select: { password: 0 } },
        { path: "coupon" },
        { path: "provider", select: { password: 0 } },
      ],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getAdminSubscriptionsRepository = async (
  paymentType,
  provider,
  offset = 0,
  limit = 15
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      // in case no category is passed
      ...(provider && {
        $match: { provider: new mongoose.Types.ObjectId(provider) },
      }),
      ...(!provider && {
        $match: {},
      }),
    },
    {
      $lookup: {
        from: ProviderModel.collection.name,
        localField: "provider",
        foreignField: "_id",
        as: "provider",
      },
    },
    {
      $unwind: "$provider",
    },
    {
      $lookup: {
        from: PaymentModel.collection.name,
        localField: "paymentType",
        foreignField: "_id",
        as: "paymentType",
      },
    },
    {
      $unwind: "$paymentType",
    },
    {
      // in case no category is passed
      ...(paymentType && {
        $match: { "paymentType.key": paymentType },
      }),
      ...(!paymentType && {
        $match: {},
      }),
    },
    {
      $lookup: {
        from: CouponModel.collection.name,
        localField: "coupon",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $unwind: "$coupon",
    },
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $project: { _id: 0, "provider.password": 0, "customer.password": 0 },
    },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
    sort: "-createdAt",
  });
};

export const getCustomerSubscriptionsRepository = async (
  customer,
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { customer },
    {
      populate: [
        { path: "customer", select: { password: 0 } },
        {
          path: "coupon",
          populate: [
            { path: "provider", select: { password: 0 } },
            { path: "category" },
          ],
        },
        { path: "paymentType" },
      ],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
      projection: { provider: 0 },
    }
  );
};

export const getSubscriptionRepository = async ({
  _id,
  provider,
  customer,
  coupon,
}) => {
  return await providerCustomerCouponModel.findOne(
    {
      ...(_id && { _id }),
      ...(provider && { provider }),
      ...(customer && { customer }),
      ...(coupon && { coupon }),
    },
    { provider: 0 },
    {
      populate: [
        { path: "customer", select: { password: 0 } },
        {
          path: "coupon",
          populate: [
            { path: "provider", select: { password: 0 } },
            { path: "category" },
          ],
        },
        { path: "paymentType" },
      ],
      lean: true,
    }
  );
};

export const getCustomerSubscriptionRepository = async (_id, customer) => {
  return await providerCustomerCouponModel.findOne(
    { _id, provider },
    {},
    {
      populate: [
        { path: "customer", select: { password: 0 } },
        { path: "coupon" },
      ],
    }
  );
};

export const getRecentlyAdddedCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    { ...(provider && { provider }), ...(category && { category }) },
    {
      populate: [
        { path: "category" },
        { path: "provider", select: { password: 0 } },
      ],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
      projection: { "provider.password": 0 },
      lean: true,
    }
  );
};

export const getMostSellingCouponRepository = async (
  category,
  offset = 0,
  limit = 15
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
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
      // in case no category is passed
      ...(category && {
        $match: { "coupon.category": new mongoose.Types.ObjectId(category) },
      }),
      ...(!category && {
        $match: {},
      }),
    },
    {
      $lookup: {
        from: ProviderModel.collection.name,
        localField: "coupon.provider",
        foreignField: "_id",
        as: "coupon.provider",
      },
    },
    {
      $unwind: "$coupon.provider",
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "coupon.category",
        foreignField: "_id",
        as: "coupon.category",
      },
    },
    {
      $unwind: "$coupon.category",
    },
    {
      $project: { _id: 0, count: 0, "coupon.provider.password": 0 },
    },
    { $replaceRoot: { newRoot: "$coupon" } },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset,
    limit,
    lean: true,
  });
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
    ...(coupon.logoURL && {
      logoURL: process.env.SERVER_IP + coupon.logoURL.path,
    }),
  });
};

export const findCouponByIdAndProvider = async (_id, provider) => {
  return await CouponModel.findOne({ _id, provider });
};

export const updateCoupon = async (_id, provider, input) => {
  return await CouponModel.findOneAndUpdate(
    { _id, provider },
    {
      ...input,
      ...(input.logoURL && {
        logoURL: process.env.SERVER_IP + input.logoURL.path,
      }),
    },
    { new: true, omitUndefined: true }
  );
};

export const updateCouponById = async (_id, { input }) => {
  return await CouponModel.findOneAndUpdate(
    { _id },
    {
      ...input,
      ...(input.logoURL && {
        logoURL: process.env.SERVER_IP + input.logoURL.path,
      }),
    },
    { new: true, omitUndefined: true }
  );
};

export const deleteCoupon = async (_id) => {
  return await CouponModel.findOneAndDelete({ _id }, { lean: true });
};

export const deleteProviderCouponsRepository = async (provider) => {
  return await CouponModel.deleteOne({ provider });
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
    {
      limit,
      offset,
      populate: [
        { path: "category" },
        { path: "provider", select: { password: 0 } },
      ],
    }
  );
};

export const getCoupon = async ({ _id }) => {
  return await CouponModel.findOne(
    { _id },
    {},
    {
      lean: true,
      populate: [
        { path: "category" },
        { path: "coupon" },
        { path: "provider", select: { password: 0 } },
      ],
    }
  );
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

export const confirmCouponPayment = async ({ _id }) => {
  return await providerCustomerCouponModel.findOneAndUpdate(
    { _id },
    { isConfirmed: true },
    { new: true }
  );
};

export const checkIfCouponWasSold = async ({ coupon }) => {
  return await providerCustomerCouponModel.findOne(
    { coupon },
    {},
    { lean: true }
  );
};

export const findCouponByCategory = async ({ category }) => {
  return await CouponModel.findOne({ category }, {}, { lean: true });
};

export const updateCouponsRepository = async ({ ids, value }) => {
  return await CouponModel.updateMany({ _id: { $in: ids } }, value);
};

export const countCouponsRepository = async (createdAt) => {
  return await CouponModel.countDocuments({
    ...(createdAt && { createdAt: { $gte: createdAt } }),
  });
};

export const countSubscriptionsRepository = async (createdAt) => {
  return await providerCustomerCouponModel.countDocuments({
    ...(createdAt && { createdAt: { $gte: createdAt } }),
  });
};

export const getCustomerSubscribedCoupons = async (customer) => {
  return await providerCustomerCouponModel.find(
    { customer },
    { coupon: 1, _id: 0 },
    { lean: true }
  );
};

export const createSubscriptionRepository = async ({ subscription }) => {
  return await providerCustomerCouponModel.create({
    ...subscription,
    ...(subscription.image && {
      image: process.env.SERVER_IP + subscription.image.path,
    }),
  });
};

export const getUnconfirmedPaymentsRepository = async (
  offset = 0,
  limit = 15
) => {
  return await providerCustomerCouponModel.paginate(
    { isConfirmed: false },
    {
      populate: [
        { path: "customer", select: { password: 0 } },
        { path: "coupon" },
        { path: "provider", select: { password: 0 } },
      ],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
    }
  );
};
