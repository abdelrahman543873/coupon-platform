import Joi from "joi";
export const UpdateProviderInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  password: Joi.string().min(8),
  slogan: Joi.string().min(10),
  websiteLink: Joi.string().allow("").min(3),
  facebookLink: Joi.string().allow("").min(3),
  instagramLink: Joi.string().min(3).allow(""),
  twitterLink: Joi.string().min(3).allow(""),
  newPassword: Joi.string().min(8).disallow(Joi.ref("password")),
}).and("password", "newPassword");
