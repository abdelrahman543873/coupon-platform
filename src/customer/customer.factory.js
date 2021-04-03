import faker from "faker";
import { couponFactory } from "../coupon/coupon.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { generateToken } from "../utils/JWTHelper.js";
import { CustomerModel } from "./models/customer.model.js";
import { socialMediaEnum } from "./social-media-type.enum.js";

export const buildCustomerParams = async (obj = {}) => {
  return {
    _id: obj._id || (await userFactory({ role: UserRoleEnum[1] }))._id,
    isVerified: obj.isVerified || false,
    isSocialMediaVerified: obj.isSocialMediaVerified || false,
    socialMediaId: obj.socialMediaId || faker.datatype.uuid(),
    socialMediaType:
      obj.socialMediaType || faker.random.arrayElement(socialMediaEnum),
    favCoupons: obj.favCoupons || [(await couponFactory())._id],
    fcmToken: obj.fcmToken || faker.random.words(),
    profilePictureURL: obj.profilePictureURL || faker.internet.url(),
  };
};

export const CustomersFactory = async (count = 10, obj = {}) => {
  const customers = [];
  for (let i = 0; i < count; i++) {
    customers.push(await buildCustomerParams(obj));
  }
  return await CustomerModel.collection.insertMany(customers);
};

export const customerFactory = async (obj = {}) => {
  const params = await buildCustomerParams(obj);
  const customer = await CustomerModel.create(params);
  customer.token = generateToken(user._id, "CUSTOMER");
  return customer;
};
