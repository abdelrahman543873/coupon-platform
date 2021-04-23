import Joi from "joi";

export const MarkCouponUsedInput = Joi.object({
  subscription: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
