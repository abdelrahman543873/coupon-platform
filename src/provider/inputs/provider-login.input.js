import Joi from "joi";
export const ProviderLoginInput = Joi.object({
  email: Joi.string().email().lowercase(),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
  password: Joi.string().min(8),
}).or("email", "phone");
