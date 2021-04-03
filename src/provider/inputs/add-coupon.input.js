import Joi from "joi";

export const AddCouponInput = Joi.object({
  name: Joi.object({
    arabic: Joi.string().min(3),
    english: Joi.string().min(3),
  }),
  description: Joi.object({
    arabic: Joi.string().min(3),
    english: Joi.string().min(3),
  }),
  servicePrice: Joi.number().positive().precision(2),
  offerPrice: Joi.number().positive().precision(2),
  code: Joi.number().positive().max(999999),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
