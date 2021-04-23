import { CustomerModel } from "./models/customer.model.js";
import dotenv from "dotenv";
import { CouponModel } from "../coupon/models/coupon.model.js";
import mongoose from "mongoose";
import { CategoryModel } from "../category/models/category.model.js";
import { ProviderModel } from "../provider/models/provider.model.js";
import { providerCustomerCouponModel } from "../subscription/models/provider-customer-coupon.model.js";

dotenv.config();
export const CustomerRegisterRepository = async (customer) => {
  return await CustomerModel.create({
    ...customer,
    ...(customer.profilePictureURL &&
      customer.profilePictureURL.path && {
        profilePictureURL:
          process.env.SERVER_IP + customer.profilePictureURL.path,
      }),
  });
};

export const rawDeleteCustomer = async () => {
  return await CustomerModel.deleteMany({});
};

export const getCustomerRepository = async (user) => {
  return await CustomerModel.findOne({ user }, { _id: 0 }, { lean: true });
};

export const getCustomerFavCoupons = async (user) => {
  return await CustomerModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user),
      },
    },
    {
      $project: { favCoupons: 1, _id: 0 },
    },
    {
      $lookup: {
        from: CouponModel.collection.name,
        localField: "favCoupons",
        foreignField: "_id",
        as: "favCoupons",
      },
    },
    {
      $unwind: "$favCoupons",
    },
    { $replaceRoot: { newRoot: "$favCoupons" } },
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
        from: providerCustomerCouponModel.collection.name,
        as: "subscriptions",
        pipeline: [
          {
            $match: {
              isUsed: false,
              customer: new mongoose.Types.ObjectId(user),
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
        isFav: true,
      },
    },
    {
      $project: { count: 0, "provider.password": 0, subscriptions: 0 },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};

export const addFavCouponRepository = async ({ user, couponId }) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    { $addToSet: { favCoupons: couponId } },
    { new: true }
  );
};

export const removeFavCouponRepository = async ({ user, couponId }) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    { $pull: { favCoupons: couponId } },
    { new: true }
  );
};

export const addFavCouponsRepository = async ({ user, coupons }) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    { $addToSet: { favCoupons: { $each: coupons } } },
    { new: true }
  );
};

export const updateCustomerRepository = async (user, customerData) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    {
      ...customerData,
      ...(customerData.profilePictureURL && {
        profilePictureURL:
          process.env.SERVER_IP + customerData.profilePictureURL.path,
      }),
    },
    { new: true, omitUndefined: true, lean: true }
  );
};

export const getCustomerBySocialLoginRepository = async (socialMediaId) => {
  return await CustomerModel.findOne(
    { socialMediaId },
    {},
    { populate: [{ path: "user", select: { password: 0 } }], lean: true }
  );
};
