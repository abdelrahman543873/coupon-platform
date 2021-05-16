import { CouponModel } from "./models/coupon.model.js";
import dotenv from "dotenv";
import { ProviderModel } from "../provider/models/provider.model.js";
import { CategoryModel } from "../category/models/category.model.js";
import mongoose from "mongoose";
import { CustomerModel } from "../customer/models/customer.model.js";
import { providerCustomerCouponModel } from "../subscription/models/provider-customer-coupon.model.js";

dotenv.config();

export const getRecentlyAdddedCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15,
  user
) => {
  const aggregation = CouponModel.aggregate([
    {
      $match: {
        amount: { $gt: 0 },
        ...(category && { category: new mongoose.Types.ObjectId(category) }),
        ...(provider && {
          provider: new mongoose.Types.ObjectId(provider),
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
      $match: {
        "provider.isActive": true,
        "provider.isVerified": true,
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
      $lookup: {
        from: CustomerModel.collection.name,
        as: "user",
        pipeline: [
          {
            $match: {
              user: user ? new mongoose.Types.ObjectId(user._id) : user,
            },
          },
          {
            $project: { favCoupons: 1, _id: 0 },
          },
          {
            $unwind: "$favCoupons",
          },
        ],
      },
    },
    {
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        as: "subscriptions",
        pipeline: [
          {
            $match: {
              isUsed: false,
              customer: user ? new mongoose.Types.ObjectId(user._id) : user,
              $expr: { coupon: "$_id" },
            },
          },
          {
            $project: {
              coupon: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        isSubscribe: {
          $cond: [{ $in: ["$_id", "$subscriptions.coupon"] }, true, false],
        },
        isFav: {
          $cond: [{ $in: ["$_id", "$user.favCoupons"] }, true, false],
        },
      },
    },
    {
      $project: { count: 0, "provider.password": 0, user: 0, subscriptions: 0 },
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

export const getMyCouponsRepository = async (
  provider,
  category,
  offset = 0,
  limit = 15,
  sold
) => {
  const aggregation = CouponModel.aggregate([
    {
      $match: {
        ...(!sold && { amount: { $gt: 0 } }),
        ...(sold && { amount: 0 }),
        ...(category && { category: new mongoose.Types.ObjectId(category) }),
        ...(provider && {
          provider: new mongoose.Types.ObjectId(provider),
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
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        localField: "_id",
        foreignField: "coupon",
        as: "sales",
      },
    },
    {
      $addFields: {
        subCount: { $size: "$sales" },
      },
    },
    {
      $project: { count: 0, "provider.password": 0, user: 0, sales: 0 },
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
  category,
  provider,
  offset = 0,
  limit = 15,
  user,
  name
) => {
  const aggregation = CouponModel.aggregate([
    {
      $match: {
        ...(category && { category: new mongoose.Types.ObjectId(category) }),
        ...(provider && { provider: new mongoose.Types.ObjectId(provider) }),
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
      $lookup: {
        from: CustomerModel.collection.name,
        as: "user",
        pipeline: [
          {
            $match: {
              user: user ? new mongoose.Types.ObjectId(user._id) : user,
            },
          },
          {
            $project: { favCoupons: 1, _id: 0 },
          },
          {
            $unwind: "$favCoupons",
          },
        ],
      },
    },
    {
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        as: "subscriptions",
        pipeline: [
          {
            $match: {
              isUsed: false,
              customer: user ? new mongoose.Types.ObjectId(user._id) : user,
              $expr: { coupon: "$_id" },
            },
          },
          {
            $project: {
              coupon: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        isSubscribe: {
          $cond: [{ $in: ["$_id", "$subscriptions.coupon"] }, true, false],
        },
        isFav: {
          $cond: [{ $in: ["$_id", "$user.favCoupons"] }, true, false],
        },
      },
    },
    {
      $project: { count: 0, "provider.password": 0, user: 0, subscriptions: 0 },
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

export const getCoupon = async ({ _id, user }) => {
  return (
    await CouponModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
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
          "provider.isActive": true,
          "provider.isVerified": true,
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
        $lookup: {
          from: CustomerModel.collection.name,
          as: "user",
          pipeline: [
            {
              $match: {
                user: user ? new mongoose.Types.ObjectId(user) : user,
              },
            },
            {
              $project: { favCoupons: 1, _id: 0 },
            },
            {
              $unwind: "$favCoupons",
            },
          ],
        },
      },
      {
        $lookup: {
          from: providerCustomerCouponModel.collection.name,
          as: "subscriptions",
          pipeline: [
            {
              $match: {
                isUsed: false,
                customer: user ? new mongoose.Types.ObjectId(user) : user,
                $expr: { coupon: "$_id" },
              },
            },
            {
              $project: {
                coupon: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          isSubscribe: {
            $cond: [{ $in: ["$_id", "$subscriptions.coupon"] }, true, false],
          },
          isFav: {
            $cond: [{ $in: ["$_id", "$user.favCoupons"] }, true, false],
          },
        },
      },
      {
        $project: {
          count: 0,
          "provider.password": 0,
          user: 0,
          subscriptions: 0,
        },
      },
    ])
  )[0];
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
