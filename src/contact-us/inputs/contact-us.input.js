import Joi from "joi";
export const contactUsInput = Joi.object({
  email: Joi.string().email(),
  description: Joi.string().min(8),
});
