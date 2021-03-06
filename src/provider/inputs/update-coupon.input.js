import Joi from "joi";

export const UpdateCouponInput = Joi.object({
  coupon: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  enName: Joi.string().min(3),
  arName: Joi.string().min(3),
  enDescription: Joi.string().min(3),
  arDescription: Joi.string().min(3),
  servicePrice: Joi.number().positive().precision(2),
  offerPrice: Joi.number().positive().precision(2),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  amount: Joi.number().min(0).max(9999),
});
