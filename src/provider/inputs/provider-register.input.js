import Joi from "joi";
export const ProviderRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  slogan: Joi.string().min(10),
  websiteLink: Joi.string().allow("").min(3),
  facebookLink: Joi.string().allow("").min(3),
  instagramLink: Joi.string().min(3).allow(""),
  twitterLink: Joi.string().min(3).allow(""),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
});
