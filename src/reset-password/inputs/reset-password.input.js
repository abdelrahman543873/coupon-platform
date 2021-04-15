import Joi from "joi";
export const ResetPasswordInput = Joi.object({
  email: Joi.string().email().lowercase(),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
  code: Joi.number().min(4),
}).or("email", "phone");
