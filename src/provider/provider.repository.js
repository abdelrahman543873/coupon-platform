import { nanoid } from "nanoid";
import { hashPass } from "../utils/bcryptHelper.js";
import { ProviderModel } from "./models/provider.model.js";
import mongoose from "mongoose";
export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
    password: await hashPass(provider.password),
    code: nanoid(),
  });
};

export const updateProviderRepository = async (_id, providerData) => {
  return await ProviderModel.findOneAndUpdate(
    { _id },
    {
      ...providerData,
      password: await hashPass(providerData.newPassword),
    },
    { new: true }
  );
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};
