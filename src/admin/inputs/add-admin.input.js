import Joi from "joi";

export const AddAdminInput = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
}).or("email", "phone");
