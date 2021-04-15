import Joi from "joi";
export const AdminUpdateProviderInput = Joi.object({
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().lowercase().optional(),
  password: Joi.string().min(8).optional(),
  slogan: Joi.string().min(10).optional(),
  websiteLink: Joi.string().allow("").min(3).optional(),
  facebookLink: Joi.string().allow("").min(3).optional(),
  instagramLink: Joi.string().min(3).allow("").optional(),
  twitterLink: Joi.string().min(3).allow("").optional(),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
});
