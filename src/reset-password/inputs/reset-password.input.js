import Joi from "joi";
export const ResetPasswordInput = Joi.object({
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  code: Joi.number().min(4),
}).or("email", "phone");
