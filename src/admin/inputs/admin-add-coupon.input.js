import Joi from "joi";

export const AdminAddCouponInput = Joi.object({
  enName: Joi.string().min(3).required(),
  arName: Joi.string().min(3).required(),
  enDescription: Joi.string().min(3).required(),
  arDescription: Joi.string().min(3).required(),
  servicePrice: Joi.number()
    .positive()
    .precision(2)
    .greater(Joi.ref("offerPrice"))
    .required(),
  offerPrice: Joi.number().positive().precision(2).required(),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  amount: Joi.number().min(0).max(9999).required(),
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
