import Joi from "joi";
export const contactUsInput = Joi.object({
  email: Joi.string().email().lowercase().required(),
  description: Joi.string().min(8).required(),
});
