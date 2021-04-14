import faker from "faker";
import { categoryFactory } from "../category/category.factory.js";
import { providerFactory } from "../provider/provider.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { CouponModel } from "./models/coupon.model.js";
import { providerCustomerCouponModel } from "./models/provider-customer-coupon.model.js";
import { paymentFactory } from "../payment/payment.factory.js";
export const buildCouponParams = async (obj = {}) => {
  const amount =
    obj.amount === null || obj.amount === undefined
      ? faker.datatype.number(9999)
      : obj.amount;
  return {
    enDescription: obj.enDescription || faker.commerce.productDescription(),
    arDescription: obj.arDescription || faker.commerce.productDescription(),
    servicePrice: obj.servicePrice || +faker.commerce.price(),
    offerPrice: obj.offerPrice || +faker.commerce.price(),
    enName: obj.enName || faker.datatype.uuid(),
    arName: obj.arName || faker.datatype.uuid(),
    amount: amount,
    logoURL: obj.logoURL || faker.internet.url(),
    isActive: obj.isActive || true,
    category: obj.category || (await categoryFactory())._id,
    provider:
      obj.provider || (await userFactory({ role: UserRoleEnum[0] }))._id,
  };
};

export const buildProviderCustomerCouponParams = async (
  providerObj = {},
  customerObj = {},
  couponObj = {},
  subscriptionObj = {}
) => {
  return {
    transactionId: subscriptionObj.transactionId || faker.datatype.uuid(),
    //change this RED ALERT
    account: subscriptionObj.account || null,
    note: subscriptionObj.note || faker.random.words(),
    image: subscriptionObj.imgURL || faker.internet.url(),
    isConfirmed: subscriptionObj.isConfirmed || false,
    isPaid: subscriptionObj.isPaid || false,
    isUsed: subscriptionObj.isUsed || false,
    provider: providerObj.provider || (await providerFactory(providerObj)).user,
    paymentType: subscriptionObj.paymentType || (await paymentFactory())._id,
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
  couponObj = {},
  subscriptionObj = {}
) => {
  const params = await buildProviderCustomerCouponParams(
    providerObj,
    customerObj,
    couponObj,
    subscriptionObj
  );
  return await providerCustomerCouponModel.create(params);
};

export const providerCustomerCouponsFactory = async (
  count = 10,
  providerObj = {},
  customerObj = {},
  couponObj = {},
  subscriptionObj = {}
) => {
  const providerCustomerCoupons = [];
  for (let i = 0; i < count; i++) {
    providerCustomerCoupons.push(
      await buildProviderCustomerCouponParams(
        providerObj,
        customerObj,
        couponObj,
        subscriptionObj
      )
    );
  }
  return await providerCustomerCouponModel.collection.insertMany(
    providerCustomerCoupons
  );
};
