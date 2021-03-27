import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const adminValidationSchemas = {
  add: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),
    email: Joi.string().email().required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),
  login: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),

  addBank: Joi.object({
    accountNumber: Joi.string().required().error(errorsOverride),
    bankName: Joi.string().required().error(errorsOverride),
    bankAgentName: Joi.string().required().error(errorsOverride),
    city: Joi.string().required().error(errorsOverride),
    country: Joi.string().required().error(errorsOverride),
    swiftCode: Joi.string().optional().allow(null).allow(""),
  }),

  mailReply: Joi.object({
    reply: Joi.string().min(8).required().error(errorsOverride),
  }),

  resetPass: Joi.object({
    cardenality: Joi.string().required().error(errorsOverride),
  }),

  editCriditCard: Joi.object({
    merchantEmail: Joi.string().email().optional().error(errorsOverride),
    secretKey: Joi.string().optional().error(errorsOverride),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().error(errorsOverride),
    newPassword: Joi.string().min(8).required().error(errorsOverride),
  }),

  changeEmail: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
    code: Joi.string().length(5).required().error(errorsOverride),
  }),
};

export { adminValidationSchemas };
