import { ProviderModel } from "./models/provider.model.js";
export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
  });
};

export const updateProviderRepository = async (user, providerData) => {
  return await ProviderModel.findOneAndUpdate(
    { user },
    {
      ...providerData,
      ...(providerData.logoURL && { logoURL: providerData.logoURL.path }),
    },
    { new: true, omitUndefined: true }
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
export const getProviders = async (offset = 0, limit = 15) => {
  return await ProviderModel.paginate(
    {},
    { offset: offset * 10, limit, sort: "-createdAt", lean: true }
  );
};

export const getProvider = async (user) => {
  return await ProviderModel.findOne({ user });
};

export const findProviderByUserId = async (user) => {
  return await ProviderModel.findOne({ user }, { _id: 0 }, { lean: true });
};

export const manageProviderStatusRepository = async (user, isActive) => {
  return await ProviderModel.findOneAndUpdate(
    { user },
    { isActive },
    { new: true }
  );
};

export const adminDeleteProviderRepository = async (user) => {
  return await ProviderModel.findOneAndDelete({ user }, { lean: true });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};

export const countProvidersRepository = async (createdAt) => {
  return await ProviderModel.count({
    ...(createdAt && { createdAt: { $gte: createdAt } }),
  });
};
