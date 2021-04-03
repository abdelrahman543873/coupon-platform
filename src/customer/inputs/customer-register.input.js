import Joi from "joi";
export const CustomerRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().min(7),
  password: Joi.string().min(8),
});
