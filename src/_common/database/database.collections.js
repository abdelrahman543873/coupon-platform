import { CategoryModel } from "../../category/models/category.model.js";
import { CouponModel } from "../../coupon/models/coupon.model.js";
import { ProviderModel } from "../../provider/models/provider.model.js";
import { termsAndConditionsModel } from "../../terms-and-conditions/models/terms-and-conditions.model.js";
import { UserModel } from "../../user/models/user.model.js";

export const models = [
  UserModel,
  CouponModel,
  CategoryModel,
  ProviderModel,
  termsAndConditionsModel,
];
