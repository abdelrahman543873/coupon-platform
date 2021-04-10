import Joi from "joi";
export const LoginInput = Joi.object({
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  password: Joi.string().min(8).required(),
}).or("email", "phone");
