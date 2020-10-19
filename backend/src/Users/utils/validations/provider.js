import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const ProviderValidations = {
  add: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),

    email: Joi.string().email().required().error(errorsOverride),

    password: Joi.string().min(8).required().error(errorsOverride),

    slogan: Joi.string().min(3).max(30).required().error(errorsOverride),

    cities: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .required()
        .error(errorsOverride)
    ),

    districts: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .required()
        .error(errorsOverride)
    ),

    officeTele: Joi.string().min(3).required().error(errorsOverride),

    lat: Joi.string().min(3).optional().error(errorsOverride),

    lng: Joi.string().min(3).optional().error(errorsOverride),

    websiteLink: Joi.string().min(3).optional().error(errorsOverride),

    facebookLink: Joi.string().min(3).optional().error(errorsOverride),

    instaLink: Joi.string().min(3).optional().error(errorsOverride),
  }),

  login: Joi.object({
    email: Joi.string()
      .min(3)
      .max(40)
      .required()
      .error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),

  email: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
  }),

  // updateProviderPersonal: Joi.object({
  //   username: Joi.string()
  //     .min(3)
  //     .max(30)
  //     .pattern(new RegExp("^(w)*$"))
  //     .optional()
  //     .error(errorsOverride),

  //   email: Joi.string().email().optional().error(errorsOverride),
  //   countryCode: Joi.string().optional().min(2).error(errorsOverride),
  //   phone: Joi.string().optional().min(5).error(errorsOverride),

  //   gender: Joi.string()
  //     .valid("MALE", "FEMALE", "NOT-SPECIFIED")
  //     .optional()
  //     .error(errorsOverride),
  //   roles: Joi.array().items(
  //     Joi.string()
  //       .valid(
  //         "BAZAR_CREATOR",
  //         "BAZAR_PRODUCTS_EDITOR",
  //         "BAZAR_ORDER_HANDLER",
  //         "BAZAR_CUSTOMER_SERVICE"
  //       )
  //       .optional()
  //       .error(errorsOverride)
  //   ),
  //   deleteImg: Joi.boolean().optional(),
  // }),

  // changePassword: Joi.object({
  //   currentPassword: Joi.string().required().error(errorsOverride),
  //   newPassword: Joi.string().min(8).required().error(errorsOverride),
  // }),
};

export { ProviderValidations };
