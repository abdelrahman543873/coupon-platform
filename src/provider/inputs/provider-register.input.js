import Joi from "joi";
export const ProviderRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  password: Joi.string().min(8),
  slogan: Joi.string().min(10).optional(),
  websiteLink: Joi.string().allow("").min(3).optional(),
  facebookLink: Joi.string().allow("").min(3).optional(),
  instagramLink: Joi.string().min(3).allow("").optional(),
  twitterLink: Joi.string().min(3).allow("").optional(),
});
