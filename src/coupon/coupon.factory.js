import faker from "faker";
import { categoryFactory } from "../category/category.factory.js";
import { providerFactory } from "../provider/provider.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provier-customer-coupon.model.js";

export const buildCouponParams = async (obj = {}) => {
  return {
    name: {
      arabic: obj.arabicName || faker.commerce.productName(),
      english: obj.englishName || faker.commerce.productName(),
    },
    description: {
      english: obj.enDescription || faker.commerce.productDescription(),
      arabic: obj.arDescription || faker.commerce.productDescription(),
    },
    servicePrice: obj.servicePrice || faker.commerce.price(),
    offerPrice: obj.offerPrice || faker.commerce.price(),
    providerId:
      obj.providerId || (await userFactory({ role: UserRoleEnum[0] }))._id,
    categoryId: obj.categoryId || (await categoryFactory())._id,
    code: obj.code || faker.datatype.number(),
    isActive: obj.isActive || true,
    imageURL: obj.imageURL || faker.internet.url(),
  };
};

export const buildProviderCustomerCouponParams = async (
  providerObj = {},
  customerObj = {},
  couponObj = {}
) => {
  return {
    providerId:
      providerObj.providerId || (await providerFactory(providerObj))._id,
    customerId: customerObj.customerId || (await userFactory(customerObj))._id,
    couponId: couponObj.couponId || (await couponFactory(couponObj))._id,
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
