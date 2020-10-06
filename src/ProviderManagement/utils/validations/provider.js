import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const ProviderValidations = {
  add: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(new RegExp("^(w)*$"))
      .required()
      .error(errorsOverride),

    email: Joi.string().email().required().error(errorsOverride),

    password: Joi.string().min(8).required().error(errorsOverride),
    countryCode: Joi.string().required().min(2).error(errorsOverride),
    phone: Joi.string().required().min(5).error(errorsOverride),

    roles: Joi.array()
      .items(
        Joi.string()
          .valid(
            "BAZAR_CREATOR",
            "BAZAR_PRODUCTS_EDITOR",
            "BAZAR_ORDER_HANDLER",
            "BAZAR_CUSTOMER_SERVICE"
          )
          .required()
          .error(errorsOverride)
      )
      .min(1)
      .required(),
    gender: Joi.string()
      .valid("MALE", "FEMALE", "NOT-SPECIFIED")
      .required()
      .error(errorsOverride),
  }),
  login: Joi.object({
    firstCardinality: Joi.string()
      .min(3)
      .max(40)
      .required()
      .error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),
  email: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
  }),
  mobileVerification: Joi.object({
    smsToken: Joi.string().length(5).required().error(errorsOverride),
  }),
  updateProviderPersonal: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(new RegExp("^(w)*$"))
      .optional()
      .error(errorsOverride),

    email: Joi.string().email().optional().error(errorsOverride),
    countryCode: Joi.string().optional().min(2).error(errorsOverride),
    phone: Joi.string().optional().min(5).error(errorsOverride),

    gender: Joi.string()
      .valid("MALE", "FEMALE", "NOT-SPECIFIED")
      .optional()
      .error(errorsOverride),
    roles: Joi.array().items(
      Joi.string()
        .valid(
          "BAZAR_CREATOR",
          "BAZAR_PRODUCTS_EDITOR",
          "BAZAR_ORDER_HANDLER",
          "BAZAR_CUSTOMER_SERVICE"
        )
        .optional()
        .error(errorsOverride)
    ),
    deleteImg: Joi.boolean().optional(),
  }),
  changePassword: Joi.object({
    currentPassword: Joi.string().required().error(errorsOverride),
    newPassword: Joi.string().min(8).required().error(errorsOverride),
  }),
};

export { ProviderValidations };
