import Joi from "joi";

export const AddAdminInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  phone: Joi.string().min(7),
});
