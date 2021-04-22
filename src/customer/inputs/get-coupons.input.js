import Joi from "joi";
import { offSetLimit } from "../../_common/helpers/limit-skip-validation.js";
import { sectionEnum } from "../get-customer-coupons.enum.js";
export const GetCustomersCouponsInput = Joi.object({
  provider: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  section: Joi.string().valid(...sectionEnum),
  ...offSetLimit,
});
