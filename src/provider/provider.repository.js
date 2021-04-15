import { ProviderModel } from "./models/provider.model.js";
import dotenv from "dotenv";
import { hashPass } from "../utils/bcryptHelper.js";

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
      sort: "-createdAt",
      lean: true,
      projection: { _id: 0, password: 0 },
    }
  );
};

export const getProvider = async (_id) => {
  return await ProviderModel.findOne({ _id });
};

export const findProviderById = async (_id) => {
  return await ProviderModel.findOne({ _id }, {}, { lean: true });
};

export const manageProviderStatusRepository = async (_id, isActive) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    { isActive },
    { new: true }
  );
};

export const adminDeleteProviderRepository = async (_id) => {
  return await ProviderModel.findOneAndDelete({ _id }, { lean: true });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};

export const countProvidersRepository = async (createdAt) => {
  return await ProviderModel.countDocuments({
    ...(createdAt && { createdAt: { $gte: createdAt } }),
  });
};
