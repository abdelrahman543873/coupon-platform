import Joi from "joi";
export const contactUsInput = Joi.object({
  email: Joi.string().email().lowercase(),
  description: Joi.string().min(8),
});
