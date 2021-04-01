import faker from "faker";
import { categoryFactory } from "../category/category.factory.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { userFactory } from "../user/user.factory.js";
import { CouponModel } from "./models/coupon.model.js";

export const buildCouponParams = async (obj = {}) => {
  return {
    name: {
      arabic: obj.arabicName || faker.commerce.productName(),
      english: obj.englishName || faker.commerce.productName(),
    },
    description: {
      enDescription: obj.enDescription || faker.commerce.productDescription(),
      arDescription: obj.arDescription || faker.commerce.productDescription(),
    },
    providerId:
      obj.providerId || (await userFactory({ role: UserRoleEnum[0] }))._id,
    categoryId: obj.categoryId || (await categoryFactory())._id,
    code: obj.code || faker.datatype.number(),
    isActive: obj.isActive || true,
    imageURL: obj.imageURL || faker.internet.url(),
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
