import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const ClientValidations = {
  addClient: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
    mobile: Joi.string().min(10).required().error(errorsOverride),
    countryCode: Joi.string().min(3).required().error(errorsOverride),
  }),

  addClientViaSocialMedia: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    socialMediaId: Joi.string().required().error(errorsOverride),
    socialMediaType: Joi.string()
      .valid("GOOGLE", "FACEBOOK", "TWITTER")
      .required()
      .error(errorsOverride),
    mobile: Joi.string().min(8).optional().error(errorsOverride),
    countryCode: Joi.string().min(3).optional().error(errorsOverride),
    email: Joi.string().email.optional().error(errorsOverride),
  }),

  socialLogin: Joi.object({
    socialMediaId: Joi.string().required().error(errorsOverride),
  }),

  socialRegister: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    socialMediaId: Joi.string().required().error(errorsOverride),
    socialMediaType: Joi.string()
      .valid("GOOGLE", "FACEBOOK", "TWITTER")
      .required()
      .error(errorsOverride),
    mobile: Joi.string().min(8).required().error(errorsOverride),
    countryCode: Joi.string().min(3).required().error(errorsOverride),
    imgURL: Joi.string().uri().optional().error(errorsOverride),
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

  changeMobile: Joi.object({
    mobile: Joi.string().min(8).required().error(errorsOverride),
  }),

  contactUs: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
    description: Joi.string().min(8).required().error(errorsOverride),
  }),
};

export { ClientValidations };
