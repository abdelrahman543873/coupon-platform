import Joi from "joi";
export const ProviderRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  slogan: Joi.string().min(10).required(),
  officeTele: Joi.string().min(3).required(),
  websiteLink: Joi.string().allow("").min(3).optional(),
  facebookLink: Joi.string().allow("").min(3).optional(),
  instagramLink: Joi.string().min(3).allow("").optional(),
  twitterLink: Joi.string().min(3).allow("").optional(),
});
