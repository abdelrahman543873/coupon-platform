import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const addClientSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .pattern(new RegExp("^(\\w)*$"))
    .max(30)
    .required()
    .error(errorsOverride),
  email: Joi.string().email().required().error(errorsOverride),
  password: Joi.string().min(8).required().error(errorsOverride),
});

const addClientViaSocialMediaSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().error(errorsOverride),
  email: Joi.string().optional().email().error(errorsOverride),
  socialMediaId: Joi.string().required().error(errorsOverride),
  socialMediaType: Joi.string()
    .valid("GOOGLE", "FACEBOOK", "TWITTER")
    .required()
    .error(errorsOverride),
});

const socialLoginSchema = Joi.object({
  socialMediaId: Joi.string().required().error(errorsOverride),
});

const socialAuth = Joi.object({
  username: Joi.string().min(3).max(30).required().error(errorsOverride),
  userPicURL: Joi.string().error(errorsOverride),
  email: Joi.string().email().required().error(errorsOverride),
  socialMediaId: Joi.string().required().error(errorsOverride),
  socialMediaType: Joi.string()
    .valid("GOOGLE", "FACEBOOK", "TWITTER")
    .required()
    .error(errorsOverride),
});

const emailVerifivationSchema = Joi.object({
  email: Joi.string().email().required().error(errorsOverride),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().error(errorsOverride),
  password: Joi.string().min(8).required().error(errorsOverride),
});

const addMobileSchema = Joi.object({
  countryCode: Joi.string().min(2).required().error(errorsOverride),
  mobile: Joi.string().min(5).required().error(errorsOverride),
});

const verifyMobileSchema = Joi.object({
  smsToken: Joi.string().min(5).max(5).required().error(errorsOverride),
});

const updateProfile = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^(\\w)*$"))
    .min(3)
    .max(30)
    .optional()
    .error(errorsOverride),

  email: Joi.string().email().optional().error(errorsOverride),

  countryCode: Joi.string().min(2).optional().error(errorsOverride),

  mobile: Joi.string().optional().min(5).error(errorsOverride),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "NOT-SPECIFIED")
    .optional()
    .error(errorsOverride),
  deleteImg: Joi.boolean().optional(),
});

const changePassword = Joi.object({
  currentPassword: Joi.string().required().error(errorsOverride),
  newPassword: Joi.string().min(8).required().error(errorsOverride),
});

export {
  updateProfile,
  changePassword,
  addClientSchema,
  addClientViaSocialMediaSchema,
  addMobileSchema,
  loginSchema,
  verifyMobileSchema,
  emailVerifivationSchema,
  socialLoginSchema,
  socialAuth,
};
