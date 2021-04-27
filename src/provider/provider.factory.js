import faker from "faker";
import { UserRoleEnum } from "../user/user-role.enum";
import { userFactory } from "../user/user.factory";
import { hashPass } from "../utils/bcryptHelper";
import { generateToken } from "../utils/JWTHelper";
import { ProviderModel } from "./models/provider.model.js";
import mongoose from "mongoose";

export const buildProviderParams = async (obj = {}) => {
  const qrURL =
    obj.qrURL === null || typeof obj.qrURL === "string"
      ? obj.qrURL
      : faker.internet.url();
  const location = [+faker.address.longitude(), +faker.address.latitude()];
  return {
    name: obj.name || faker.name.firstName(),
    email: obj.email || faker.internet.email().toLowerCase(),
    password: obj.password || faker.internet.password(),
    role: UserRoleEnum[0],
    slogan: obj.slogan || faker.commerce.productDescription(),
    image: obj.image || faker.internet.url(),
    isActive: obj.isActive || false,
    websiteLink: obj.websiteLink || faker.internet.url(),
    facebookLink: obj.facebookLink || faker.internet.url(),
    instagramLink: obj.instagramLink || faker.internet.url(),
    twitterLink: obj.twitterLink || faker.internet.url(),
    fcmToken: obj.fcmToken || faker.random.word(),
    qrURL: qrURL,
    phone: obj.phone || faker.phone.phoneNumber("+20165#######"),
    locations: obj.locations || {
      coordinates: [location],
    },
    metaData: obj.metaData || [
      {
        long: location[0],
        lat: location[1],
        formattedAddressAr: faker.address.streetAddress(),
        formattedAddressEn: faker.address.streetAddress(),
        level2longAr: faker.address.streetPrefix(),
        level2longEn: faker.address.streetPrefix(),
        googlePlaceId: faker.address.zipCode(),
      },
    ],
    code: obj.code || mongoose.Types.ObjectId(),
  };
};

export const providersFactory = async (count = 10, obj = {}) => {
  const providers = [];
  for (let i = 0; i < count; i++) {
    providers.push(await buildProviderParams(obj));
  }
  return await ProviderModel.collection.insertMany(providers);
};

export const providerFactory = async (obj = {}) => {
  const params = await buildProviderParams(obj);
  params.password = await hashPass(params.password);
  const provider = await ProviderModel.create(params);
  provider.token = generateToken(provider._id, "PROVIDER");
  return provider;
};
