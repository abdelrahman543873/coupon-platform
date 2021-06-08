import { CouponModel } from "../coupon/models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provider-customer-coupon.model.js";
import { ProviderModel } from "../provider/models/provider.model.js";
import { CategoryModel } from "../category/models/category.model.js";
import mongoose from "mongoose";
import { PaymentModel } from "../payment/models/payment.model.js";
import { UserModel } from "../user/models/user.model.js";
import { CustomerModel } from "../customer/models/customer.model.js";

export const getRecentlySoldCouponsRepository = async (
  provider,
  offset = 0,
  limit = 15,
  category,
  sold
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      $match: { ...(provider && { provider }), ...(category && { category }) },
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
        ...(sold === true && { "coupon.amount": 0 }),
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
      $addFields: {
        "coupon.subCount": "$count",
      },
    },
    {
      $project: {
        _id: 0,
        "coupon.provider.password": 0,
      },
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

export const getSubscriptionsRepository = async (
  provider,
  offset = 0,
  coupon,
  limit = 15
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      $match: {
        ...(provider && { provider: new mongoose.Types.ObjectId(provider) }),
        ...(coupon && { coupon: new mongoose.Types.ObjectId(coupon) }),
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
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        localField: "coupon",
        foreignField: "coupon",
        as: "sales",
      },
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
        "coupon.subCount": { $size: "$sales" },
      },
    },
    { $project: { "provider.password": 0, "customer.password": 0, sales: 0 } },
    { $sort: { createdAt: -1 } },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
  });
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
  code,
  isUsed
) => {
  const aggregation = providerCustomerCouponModel.aggregate([
    {
      $match: {
        isConfirmed: true,
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
      $lookup: {
        from: CustomerModel.collection.name,
        as: "user",
        pipeline: [
          {
            $match: {
              user: new mongoose.Types.ObjectId(customer),
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
              enRejectionReason: { $exists: false },
              arRejectionReason: { $exists: false },
              customer: new mongoose.Types.ObjectId(customer),
              $expr: { coupon: "$coupon._id" },
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
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        as: "rejectedSubscriptions",
        pipeline: [
          {
            $match: {
              isUsed: false,
              enRejectionReason: { $exists: true },
              arRejectionReason: { $exists: true },
              customer: new mongoose.Types.ObjectId(customer),
              $expr: { coupon: "$coupon._id" },
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
        "coupon.isRejected": {
          $cond: [
            { $in: ["$coupon._id", "$rejectedSubscriptions.coupon"] },
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
        user: 0,
        count: 0,
        provider: 0,
        // subscriptions: 0,
        "customer.password": 0,
        // rejectedSubscriptions: 0,
        "coupon.provider.password": 0,
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
                user: new mongoose.Types.ObjectId(customer),
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
                $expr: { coupon: "$coupon._id" },
                enRejectionReason: { $exists: false },
                arRejectionReason: { $exists: false },
                customer: new mongoose.Types.ObjectId(customer),
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
        $lookup: {
          from: providerCustomerCouponModel.collection.name,
          as: "rejectedSubscriptions",
          pipeline: [
            {
              $match: {
                isUsed: false,
                $expr: { coupon: "$coupon._id" },
                enRejectionReason: { $exists: true },
                arRejectionReason: { $exists: true },
                customer: new mongoose.Types.ObjectId(customer),
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
          "coupon.isRejected": {
            $cond: [
              { $in: ["$coupon._id", "$rejectedSubscriptions.coupon"] },
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
          user: 0,
          count: 0,
          provider: 0,
          subscriptions: 0,
          "customer.password": 0,
          rejectedSubscriptions: 0,
          "coupon.provider.password": 0,
        },
      },
      { $sort: { createdAt: -1 } },
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
          from: providerCustomerCouponModel.collection.name,
          localField: "coupon",
          foreignField: "coupon",
          as: "sales",
        },
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
        $addFields: {
          "coupon.subCount": { $size: "$sales" },
        },
      },
      {
        $project: {
          count: 0,
          sales: 0,
          provider: 0,
          "customer.password": 0,
          "coupon.provider.password": 0,
        },
      },
    ])
  )[0];
};

export const getCustomerCouponNotUsedSubscriptionRepository = async ({
  customer,
  coupon,
  provider,
  _id,
}) => {
  return await providerCustomerCouponModel.findOne(
    {
      ...(_id && { _id }),
      ...(customer && { customer }),
      ...(coupon && { coupon }),
      ...(provider && { provider }),
      isUsed: false,
      enRejectionReason: { $exists: false },
      arRejectionReason: { $exists: false },
    },
    {}
  );
};

export const getMostSellingCouponRepository = async (
  category,
  offset = 0,
  limit = 15,
  provider,
  user
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
        "coupon.amount": { $gt: 0 },
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
      $match: {
        "coupon.provider.isActive": true,
        "coupon.provider.isVerified": true,
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
    { $replaceRoot: { newRoot: "$coupon" } },
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
              $expr: { coupon: "$_id" },
              enRejectionReason: { $exists: false },
              arRejectionReason: { $exists: false },
              customer: user ? new mongoose.Types.ObjectId(user._id) : user,
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
      $lookup: {
        from: providerCustomerCouponModel.collection.name,
        as: "rejectedSubscriptions",
        pipeline: [
          {
            $match: {
              isUsed: false,
              $expr: { coupon: "$_id" },
              enRejectionReason: { $exists: true },
              arRejectionReason: { $exists: true },
              customer: user ? new mongoose.Types.ObjectId(user._id) : user,
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
        isRejected: {
          $cond: [
            { $in: ["$_id", "$rejectedSubscriptions.coupon"] },
            true,
            false,
          ],
        },
        isFav: {
          $cond: [{ $in: ["$_id", "$user.favCoupons"] }, true, false],
        },
      },
    },
    {
      $project: {
        user: 0,
        count: 0,
        subscriptions: 0,
        rejectedSubscriptions: 0,
        "coupon.provider.password": 0,
      },
    },
  ]);
  return await providerCustomerCouponModel.aggregatePaginate(aggregation, {
    offset: offset * limit,
    limit,
    lean: true,
  });
};

export const markCouponUsedRepository = async ({ coupon, customer, _id }) => {
  return await providerCustomerCouponModel.findOneAndUpdate(
    { ...(customer && { customer }), ...(coupon && { coupon }), _id },
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
        {
          path: "paymentType",
        },
        {
          path: "customer",
        },
      ],
      projection: { provider: 0 },
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

export const getProviderHomeRepository = async (provider) => {
  const numberOfSoldCoupons = await providerCustomerCouponModel.countDocuments({
    provider,
    isConfirmed: true,
  });

  const numberOfCoupons =
    (
      await CouponModel.aggregate([
        {
          $match: {
            provider: new mongoose.Types.ObjectId(provider),
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $project: { _id: 0 },
        },
      ])
    )[0]?.total || 0;
  return {
    numberOfSoldCoupons,
    numberOfCoupons,
    remainingCoupons: numberOfCoupons - numberOfSoldCoupons,
  };
};

export const checkIfCouponWasSold = async ({ coupon }) => {
  return await providerCustomerCouponModel.findOne(
    { coupon },
    {},
    { lean: true }
  );
};

export const rawDeleteProviderCustomerCoupon = async () => {
  return await providerCustomerCouponModel.deleteMany({});
};

export const confirmCouponPayment = async ({
  _id,
  isConfirmed,
  enRejectionReason,
  arRejectionReason,
}) => {
  return await providerCustomerCouponModel.findOneAndUpdate(
    { _id },
    {
      isConfirmed,
      ...(enRejectionReason && { enRejectionReason }),
      ...(arRejectionReason && { arRejectionReason }),
    },
    { new: true }
  );
};
