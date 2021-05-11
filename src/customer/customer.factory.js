import faker from "faker";
import { couponFactory } from "../coupon/coupon.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import { CustomerModel } from "./models/customer.model.js";
import { socialMediaEnum } from "./social-media-type.enum.js";

export const buildCustomerParams = async (obj = {}) => {
  return {
    user: obj.user || (await userFactory({ role: UserRoleEnum[1] }))._id,
    isVerified: obj.isVerified || true,
    isSocialMediaVerified: obj.isSocialMediaVerified || false,
    socialMediaId: obj.socialMediaId || faker.datatype.uuid(),
    socialMediaType:
      obj.socialMediaType || faker.random.arrayElement(socialMediaEnum),
    favCoupons: obj.favCoupons || [(await couponFactory())._id],
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
  customer.token = generateToken(customer.user, "CUSTOMER");
  return customer;
};
