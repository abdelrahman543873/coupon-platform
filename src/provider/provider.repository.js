import { nanoid } from "nanoid";
import { hashPass } from "../utils/bcryptHelper.js";
import { ProviderModel, provider } from "./models/provider.model.js";
export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
    code: nanoid(),
  });
};

export const updateProviderRepository = async (_id, providerData) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    {
      ...providerData,
      ...(providerData.logoURL && { logoURL: providerData.logoURL.path }),
    },
    { new: true }
  );
};

export const findProviderByUserId = async (_id) => {
  return await ProviderModel.findOne({ _id });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};
