import faker from "faker";
import { categoryFactory } from "../category/category.factory.js";
import { providerFactory } from "../provider/provider.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provier-customer-coupon.model.js";

export const buildCouponParams = async (obj = {}) => {
  return {
    enName: obj.enName || faker.commerce.productName(),
    arName: obj.arName || faker.commerce.productName(),
    enDescription: obj.enDescription || faker.commerce.productDescription(),
    arDescription: obj.arDescription || faker.commerce.productDescription(),
    servicePrice: obj.servicePrice || faker.commerce.price(),
    offerPrice: obj.offerPrice || faker.commerce.price(),
    provider:
      obj.provider || (await userFactory({ role: UserRoleEnum[0] }))._id,
    category: obj.category || (await categoryFactory())._id,
    code: obj.code || faker.datatype.number(),
    isActive: obj.isActive || true,
    logoURL: obj.logoURL || faker.internet.url(),
  };
};

export const buildProviderCustomerCouponParams = async (
  providerObj = {},
  customerObj = {},
  couponObj = {}
) => {
  return {
    provider: providerObj.provider || (await providerFactory(providerObj))._id,
    customer: customerObj.customer || (await userFactory(customerObj))._id,
    coupon: couponObj.coupon || (await couponFactory(couponObj))._id,
  };
};

export const couponsFactory = async (count = 10, obj = {}) => {
  const coupons = [];
  for (let i = 0; i < count; i++) {
    coupons.push(await buildCouponParams(obj));
  }
  return await CouponModel.collection.insertMany(coupons);
};

export const couponFactory = async (obj = {}) => {
  const params = await buildCouponParams(obj);
  return await CouponModel.create(params);
};

export const providerCustomerCouponFactory = async (
  providerObj = {},
  customerObj = {},
  couponObj = {}
) => {
  const params = await buildProviderCustomerCouponParams(
    providerObj,
    customerObj,
    couponObj
  );
  return await providerCustomerCouponModel.create(params);
};

export const providerCustomerCouponsFactory = async (
  count = 10,
  providerObj = {},
  customerObj = {},
  couponObj = {}
) => {
  const providerCustomerCoupons = [];
  for (let i = 0; i < count; i++) {
    providerCustomerCoupons.push(
      await buildProviderCustomerCouponParams(
        providerObj,
        customerObj,
        couponObj
      )
    );
  }
  return await providerCustomerCouponModel.collection.insertMany(
    providerCustomerCoupons
  );
};
