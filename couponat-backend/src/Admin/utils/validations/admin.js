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
    email: Joi.string().email().required().error(errorsOverride),
    reply: Joi.string().min(8).required().error(errorsOverride),
  }),

  resetPass: Joi.object({
    cardenality: Joi.string().required().error(errorsOverride),
  }),
};

export { adminValidationSchemas };
