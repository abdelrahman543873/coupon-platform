import { ProviderModel } from "./models/provider.model.js";
import dotenv from "dotenv";
import { hashPass } from "../_common/helpers/bcryptHelper.js";
import mongoose from "mongoose";

dotenv.config();
export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
    ...(provider.image && {
      image: process.env.SERVER_IP + provider.image.path,
    }),
    ...(provider.email && { email: provider.email.toLowerCase() }),
    ...(provider.password && { password: await hashPass(provider.password) }),
  });
};

export const updateProviderRepository = async (_id, providerData) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    {
      ...providerData,
      ...(providerData.image && {
        image: process.env.SERVER_IP + providerData.image.path,
      }),
      ...(providerData.qrURL && {
        qrURL: process.env.SERVER_IP + providerData.qrURL,
      }),
      ...(providerData.newPassword && {
        password: await hashPass(providerData.newPassword),
      }),
    },
    { new: true, omitUndefined: true, lean: true, projection: { password: 0 } }
  );
};
export const findProviderByEmailForLogin = async ({ provider }) => {
  // fix this
  if (!provider.email) return null;
  return await ProviderModel.findOne({
    email: provider.email.toLowerCase(),
  });
};

export const findProviderByEmail = async ({ email }) => {
  return await ProviderModel.findOne(
    {
      email,
    },
    { password: 0 },
    { lean: true }
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
export const getProviders = async (offset = 0, limit = 15) => {
  return await ProviderModel.paginate(
    {},
    {
      offset: offset * limit,
      limit,
      lean: true,
      projection: { password: 0 },
      sort: { createdAt: -1 },
    }
  );
};

export const getProvider = async (_id) => {
  return await ProviderModel.findOne({ _id });
};

export const findProviderById = async (_id) => {
  return await ProviderModel.findOne({ _id }, { password: 0 }, { lean: true });
};

export const manageProviderStatusRepository = async (_id, isActive, qrURL) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    { isActive, ...(qrURL && { qrURL: `${process.env.SERVER_IP}${qrURL}` }) },
    { new: true }
  );
};

export const adminDeleteProviderRepository = async (_id) => {
  return await ProviderModel.findOneAndDelete({ _id }, { lean: true });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};

export const getAllProvidersWithQrUrlRepository = async () => {
  return await ProviderModel.find({ qrURL: { $exists: true } });
};

export const countProvidersRepository = async (createdAt) => {
  return await ProviderModel.countDocuments({
    ...(createdAt && { createdAt: { $gte: createdAt } }),
  });
};

export const deleteProviderLocation = async ({ _id, location }) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    {
      $pull: {
        "locations.coordinates": location,
        metaData: { long: location[0], lat: location[1] },
      },
    },
    { new: true, lean: true }
  );
};

export const getAllProvidersTokens = async () => {
  return await ProviderModel.distinct("fcmToken");
};

export const getProviderLocationsRepository = async ({ _id }) => {
  return await ProviderModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(_id) } },
    { $unwind: "$metaData" },
    { $project: { metaData: 1, _id: 0 } },
    {
      $group: {
        _id: {
          enName: "$metaData.enName",
          arName: "$metaData.arName",
          center: "$metaData.center",
        },
        locations: {
          $push: "$metaData",
        },
      },
    },
  ]);
};
