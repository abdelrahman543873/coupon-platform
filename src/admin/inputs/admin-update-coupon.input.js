import Joi from "joi";

export const AdminUpdateCouponInput = Joi.object({
  coupon: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  enName: Joi.string().min(3).optional(),
  arName: Joi.string().min(3).optional(),
  enDescription: Joi.string().min(3).optional(),
  arDescription: Joi.string().min(3).optional(),
  servicePrice: Joi.number().positive().precision(2).optional(),
  offerPrice: Joi.number()
    .positive()
    .precision(2)
    .less(Joi.ref("servicePrice"))
    .optional(),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  amount: Joi.number().min(0).max(9999),
}).with("offerPrice", "servicePrice");
