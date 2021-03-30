import Joi from "joi";
export const UpdateProviderInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(8),
  slogan: Joi.string().min(10),
  officeTele: Joi.string().min(3),
  websiteLink: Joi.string().allow("").min(3),
  facebookLink: Joi.string().allow("").min(3),
  instagramLink: Joi.string().min(3).allow(""),
  twitterLink: Joi.string().min(3).allow(""),
  newPassword: Joi.string().min(8),
}).and("password", "newPassword");
