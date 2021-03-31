import { nanoid } from "nanoid";
import { hashPass } from "../utils/bcryptHelper.js";
import { ProviderModel, provider } from "./models/provider.model.js";
export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
    code: nanoid(),
  });
};

export const updateProviderRepository = async (userId, providerData) => {
  return await ProviderModel.findOneAndUpdate(
    { userId },
    {
      ...providerData,
    },
    { new: true }
  );
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};
