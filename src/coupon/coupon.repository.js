import { CouponModel } from "./models/coupon.model.js";
import dotenv from "dotenv";
import { ProviderModel } from "../provider/models/provider.model.js";
import { CategoryModel } from "../category/models/category.model.js";
import mongoose from "mongoose";
import { PaymentModel } from "../payment/models/payment.model.js";
import { UserModel } from "../user/models/user.model.js";
import { CustomerModel } from "../customer/models/customer.model.js";

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
      populate: [{ path: "provider category", select: { password: 0 } }],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getCompletelySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    { ...(provider && { provider }), amount: 0 },
    {
      populate: [{ path: "provider category", select: { password: 0 } }],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getNotCompletelySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  return await CouponModel.paginate(
    { ...(provider && { provider }), amount: { $gt: 0 } },
    {
      populate: [{ path: "provider category", select: { password: 0 } }],
      offset: offset * limit,
      limit,
      sort: "-createdAt",
    }
  );
};

export const getRecentlyAdddedCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15,
  subscriptions = [],
  favCoupons = []
) => {
  const aggregation = CouponModel.aggregate([
    {
      $match: {
        ...(category && { category: new mongoose.Types.ObjectId(category) }),
      },
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
      $match: {
        ...(provider && {
          "provider._id": new mongoose.Types.ObjectId(provider),
        }),
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $addFields: {
        isSubscribe: {
          $cond: [{ $in: ["$_id", subscriptions] }, true, false],
        },
        isFav: {
          $cond: [{ $in: ["$_id", favCoupons] }, true, false],
        },
      },
    },
    {
      $project: { count: 0, "provider.password": 0 },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return await CouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
    lean: true,
  });
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

export const searchCouponsRepository = async (
  name,
  offset = 0,
  limit = 15,
  category,
  subscriptions,
  favCoupons
) => {
  const aggregation = CouponModel.aggregate([
    {
      $match: {
        ...(category && { category: new mongoose.Types.ObjectId(category) }),
        ...(name && {
          $or: [
            { enName: { $regex: name, $options: "i" } },
            { arName: { $regex: name, $options: "i" } },
          ],
        }),
      },
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
        from: CategoryModel.collection.name,
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $addFields: {
        isSubscribe: {
          $cond: [{ $in: ["$_id", subscriptions] }, true, false],
        },
        isFav: {
          $cond: [{ $in: ["$_id", favCoupons] }, true, false],
        },
      },
    },
    {
      $project: { count: 0, "provider.password": 0 },
    },
  ]);
  return await CouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
    lean: true,
  });
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
