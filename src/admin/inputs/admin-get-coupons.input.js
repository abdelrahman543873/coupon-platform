import Joi from "joi";
import { offSetLimit } from "../../_common/helpers/limit-skip-validation.js";
export const GetCouponsInput = Joi.object({
  provider: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  ...offSetLimit,
});
