import Joi from "joi";
export const UpdateProviderInput = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().lowercase().optional(),
  password: Joi.string()
    .min(8)
    .optional()
    .when("email", { then: Joi.string().min(8).required() })
    .when("newPassword", {
      then: Joi.string().min(8).disallow(Joi.ref("newPassword")).required(),
    }),
  slogan: Joi.string().min(10).optional(),
  websiteLink: Joi.string().allow("").min(3).optional(),
  facebookLink: Joi.string().allow("").min(3).optional(),
  instagramLink: Joi.string().min(3).allow("").optional(),
  twitterLink: Joi.string().min(3).allow("").optional(),
  newPassword: Joi.string().min(8).optional(),
});
