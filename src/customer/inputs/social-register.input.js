import Joi from "joi";
export const SocialRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  socialMediaId: Joi.string(),
  socialMediaType: Joi.string(),
  phone: Joi.string().min(8).optional(),
  email: Joi.string().email().lowercase().optional(),
});
