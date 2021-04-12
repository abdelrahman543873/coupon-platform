import Joi from "joi";
export const AddProviderInput = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  password: Joi.string().min(8).required(),
  slogan: Joi.string().min(10),
  websiteLink: Joi.string().allow("").min(3),
  facebookLink: Joi.string().allow("").min(3),
  instagramLink: Joi.string().min(3).allow(""),
  twitterLink: Joi.string().min(3).allow(""),
}).or("email", "phone");
