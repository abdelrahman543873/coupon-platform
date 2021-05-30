import faker from "faker";
import { UserRoleEnum } from "../user/user-role.enum";
import { hashPass } from "../_common/helpers/bcryptHelper.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import { ProviderModel } from "./models/provider.model.js";
import mongoose from "mongoose";

export const buildProviderParams = async (obj = {}) => {
  const location = [+faker.address.longitude(), +faker.address.latitude()];
  return {
    name: obj.name || faker.name.firstName(),
    email: obj.email || faker.internet.email().toLowerCase(),
    password: obj.password || faker.internet.password(),
    role: UserRoleEnum[0],
    slogan: obj.slogan || faker.commerce.productDescription(),
    image: obj.image || faker.internet.url(),
    isActive: obj.isActive ?? true,
    isVerified: obj.isVerified ?? true,
    websiteLink: obj.websiteLink || faker.internet.url(),
    facebookLink: obj.facebookLink || faker.internet.url(),
    instagramLink: obj.instagramLink || faker.internet.url(),
    twitterLink: obj.twitterLink || faker.internet.url(),
    fcmToken: obj.fcmToken ?? "",
    qrURL: obj.qrURL ?? null,
    phone: obj.phone || faker.phone.phoneNumber("+20165#######"),
    locations: obj.locations ?? {
      coordinates: [location],
    },
    metaData: obj.metaData ?? [
      {
        lat: location[1],
        long: location[0],
        enName: faker.address.city(),
        arName: faker.address.city(),
        googlePlaceId: faker.address.zipCode(),
        level2longAr: faker.address.streetPrefix(),
        level2longEn: faker.address.streetPrefix(),
        formattedAddressAr: faker.address.streetAddress(),
        formattedAddressEn: faker.address.streetAddress(),
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
