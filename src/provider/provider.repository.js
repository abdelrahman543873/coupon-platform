import { nanoid } from "nanoid";
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
    { new: true }
  );
};

export const findProviderByUserId = async (user) => {
  return await ProviderModel.findOne({ user });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};
