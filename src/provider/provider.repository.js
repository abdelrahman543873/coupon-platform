import { nanoid } from "nanoid";
import { hashPass } from "../utils/bcryptHelper.js";
import { ProviderModel } from "./models/provider.model.js";

export const providerRegisterRepository = async (provider) => {
  return await ProviderModel.create({
    ...provider,
    password: await hashPass(provider.password),
    code: nanoid(),
  });
};

export const rawDeleteProvider = async () => {
  return await ProviderModel.deleteMany({});
};
