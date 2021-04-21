import { nanoid } from "nanoid";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provider-customer-coupon.model.js";
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

export const getProviderSoldCoupons = async (provider) => {
  return await providerCustomerCouponModel.find(
    { provider },
    {},
    { lean: true }
  );
};
export const getRecentlySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    { $match: { ...(provider && { provider }) } },
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
    { $sort: { createdAt: -1 } },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset,
    limit,
    lean: true,
  });
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

export const getSubscriptionsRepository = async (
  provider,
  offset = 0,
  limit = 15,
  coupon
) => {
  return await providerCustomerCouponModel.paginate(
    { ...(provider && { provider }), ...(coupon && { coupon }) },
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
      $match: {
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
      $match: { ...(paymentType && { "paymentType.key": paymentType }) },
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
      $project: { "provider.password": 0, "customer.password": 0 },
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
  limit = 15,
  subscriptions = [],
  favCoupons = [],
  code,
  isUsed
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      $match: {
        ...(isUsed !== undefined && {
          isUsed,
        }),
        ...(customer && {
          customer: new mongoose.Types.ObjectId(customer),
        }),
      },
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
      $match: {
        ...(code && {
          "coupon.provider.code": new mongoose.Types.ObjectId(code),
        }),
      },
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
      $addFields: {
        "coupon.isSubscribe": {
          $cond: [{ $in: ["$coupon._id", subscriptions] }, true, false],
        },
        "coupon.isFav": {
          $cond: [{ $in: ["$coupon._id", favCoupons] }, true, false],
        },
      },
    },
    {
      $project: {
        count: 0,
        "coupon.provider.password": 0,
        "customer.password": 0,
        provider: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
  });
};

export const getCustomerSubscriptionRepository = async ({
  _id,
  provider,
  customer,
  coupon,
}) => {
  // we only need the first element in the aggregation
  return (
    await providerCustomerCouponModel.aggregate([
      {
        $match: {
          ...(_id && { _id: new mongoose.Types.ObjectId(_id) }),
          ...(provider && { provider: new mongoose.Types.ObjectId(provider) }),
          ...(customer && { customer: new mongoose.Types.ObjectId(customer) }),
          ...(coupon && { coupon: new mongoose.Types.ObjectId(coupon) }),
        },
      },
      { $limit: 1 },
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
        $lookup: {
          from: CustomerModel.collection.name,
          as: "user",
          pipeline: [
            {
              $match: {
                $expr: { user: "$customer.user" },
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: providerCustomerCouponModel.collection.name,
          as: "subscriptions",
          pipeline: [
            {
              $match: {
                isUsed: false,
                $expr: { customer: "$customer.user" },
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
          "coupon.isSubscribe": {
            $cond: [
              { $in: ["$coupon._id", "$subscriptions.coupon"] },
              true,
              false,
            ],
          },
          "coupon.isFav": {
            $cond: [{ $in: ["$coupon._id", "$user.favCoupons"] }, true, false],
          },
        },
      },
      {
        $project: {
          count: 0,
          "coupon.provider.password": 0,
          "customer.password": 0,
          provider: 0,
          user: 0,
          subscriptions: 0,
        },
      },
    ])
  )[0];
};

export const getSubscriptionRepository = async ({
  _id,
  provider,
  customer,
  coupon,
}) => {
  // we only need the first element in the aggregation
  return (
    await providerCustomerCouponModel.aggregate([
      {
        $match: {
          ...(_id && { _id: new mongoose.Types.ObjectId(_id) }),
          ...(provider && { provider: new mongoose.Types.ObjectId(provider) }),
          ...(customer && { customer: new mongoose.Types.ObjectId(customer) }),
          ...(coupon && { coupon: new mongoose.Types.ObjectId(coupon) }),
        },
      },
      { $limit: 1 },
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
        $project: {
          count: 0,
          "coupon.provider.password": 0,
          "customer.password": 0,
          provider: 0,
        },
      },
    ])
  )[0];
};

export const getCustomerCouponNotUsedSubscriptionRepository = async ({
  customer,
  coupon,
  provider,
}) => {
  return await providerCustomerCouponModel.findOne(
    { customer, provider, coupon, isUsed: false },
    {}
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

export const getMostSellingCouponRepository = async (
  category,
  offset = 0,
  limit = 15,
  subscriptions = [],
  favCoupons = [],
  provider
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      $match: {
        ...(provider && {
          provider: new mongoose.Types.ObjectId(provider),
        }),
      },
    },
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
      $match: {
        ...(category && {
          "coupon.category": new mongoose.Types.ObjectId(category),
        }),
      },
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

export const markCouponUsedRepository = async ({ coupon, customer }) => {
  return await providerCustomerCouponModel.findOneAndUpdate(
    { customer, coupon },
    { isUsed: true },
    {
      new: true,
      populate: [
        {
          path: "coupon",
          populate: {
            path: "provider category",
            select: { password: 0 },
          },
        },
      ],
    }
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
    { customer, isUsed: false },
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
