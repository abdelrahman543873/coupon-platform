import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const ClientValidations = {
  addClient: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
    mobile: Joi.string().min(8).required().error(errorsOverride),
    countryCode: Joi.string().min(3).required().error(errorsOverride),
  }),

  addClientViaSocialMedia: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    socialMediaId: Joi.string().required().error(errorsOverride),
    socialMediaType: Joi.string()
      .valid("GOOGLE", "FACEBOOK", "TWITTER")
      .required()
      .error(errorsOverride),
    mobile: Joi.string().min(8).required().error(errorsOverride),
    countryCode: Joi.string().min(8).required().error(errorsOverride),
  }),

  socialLogin: Joi.object({
    socialMediaId: Joi.string().required().error(errorsOverride),
  }),

  socialAuth: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    socialMediaId: Joi.string().required().error(errorsOverride),
    socialMediaType: Joi.string()
      .valid("GOOGLE", "FACEBOOK", "TWITTER")
      .required()
      .error(errorsOverride),
  }),

  login: Joi.object({
    mobile: Joi.string().required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),

  verifyMobile: Joi.object({
    smsToken: Joi.string().min(5).max(5).required().error(errorsOverride),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().error(errorsOverride),
    newPassword: Joi.string().min(8).required().error(errorsOverride),
  }),
};

export { ClientValidations };
