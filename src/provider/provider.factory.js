import faker from "faker";
import { UserRoleEnum } from "../user/user-role.enum";
import { userFactory } from "../user/user.factory";
import { generateToken } from "../utils/JWTHelper";
import { ProviderModel } from "./models/provider.model.js";

export const buildProviderParams = async (obj = {}) => {
  return {
    user: obj.user || (await userFactory({ role: UserRoleEnum[0] }))._id,
    slogan: obj.slogan || faker.lorem.slug(),
    logoURL: obj.logoURL || faker.internet.url(),
    isActive: obj.isActive || faker.datatype.boolean(),
    code: obj.code || faker.datatype.number(),
    websiteLink: obj.websiteLink || faker.internet.url(),
    facebookLink: obj.facebookLink || faker.internet.url(),
    instagramLink: obj.instagramLink || faker.internet.url(),
    twitterLink: obj.twitterLink || faker.internet.url(),
    fcmToken: obj.fcmToken || faker.random.objectElement(),
    qrURL: obj.qrURL || faker.internet.url(),
  };
};

export const providersFactory = async (count = 10, obj = {}) => {
  const providers = [];
  for (let i = 0; i < count; i++) {
    providers.push(await buildProviderParams(obj));
  }
  return await ProviderModel.collection.insertMany(termsAndConditions);
};

export const providerFactory = async (obj = {}) => {
  const params = await buildProviderParams(obj);
  const provider = await ProviderModel.create(params);
  provider.token = generateToken(provider.user, "PROVIDER");
  return provider;
};
