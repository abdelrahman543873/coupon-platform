import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding.js";
import { checkMongooseId } from "../../../utils/mongooseIdHelper.js";

const locationSchema = Joi.object().keys({
  lat: Joi.string().required().error(errorsOverride),
  long: Joi.string().required().error(errorsOverride),
});

const ProviderValidations = {
  add: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),

    email: Joi.string().email().required().error(errorsOverride),

    password: Joi.string().min(8).required().error(errorsOverride),

    slogan: Joi.string().min(10).required().error(errorsOverride),

    cities: Joi.array()
      .items({
        id: Joi.custom(checkMongooseId, "custom validation")
          .required()
          .error(errorsOverride),
        locations: Joi.array()
          .items(locationSchema)
          .required()
          .error(errorsOverride),
      })
      .required()
      .error(errorsOverride),

    officeTele: Joi.string().min(3).required().error(errorsOverride),

    websiteLink: Joi.string().allow("").min(3).optional().error(errorsOverride),

    facebookLink: Joi.string()
      .allow("")
      .min(3)
      .optional()
      .error(errorsOverride),

    instaLink: Joi.string().min(3).allow("").optional().error(errorsOverride),

    twittwerLink: Joi.string()
      .min(3)
      .allow("")
      .optional()
      .error(errorsOverride),
  }),

  login: Joi.object({
    email: Joi.string().min(3).max(40).required().error(errorsOverride),
    password: Joi.string().min(8).required().error(errorsOverride),
  }),

  email: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
  }),

  updateProvider: Joi.object({
    name: Joi.string().min(3).max(30).optional().error(errorsOverride),

    email: Joi.string().email().optional().error(errorsOverride),

    password: Joi.string().min(8).optional().error(errorsOverride),

    slogan: Joi.string().min(10).optional().error(errorsOverride),

    cities: Joi.array()
      .items({
        id: Joi.custom(checkMongooseId, "custom validation")
          .required()
          .error(errorsOverride),
        locations: Joi.array()
          .items(locationSchema)
          .required()
          .error(errorsOverride),
      })
      .optional()
      .error(errorsOverride),
    officeTele: Joi.string().min(3).optional().error(errorsOverride),

    lat: Joi.string().min(3).optional().error(errorsOverride),

    lng: Joi.string().min(3).optional().error(errorsOverride),

    websiteLink: Joi.string().min(3).optional().allow("").error(errorsOverride),

    facebookLink: Joi.string()
      .min(3)
      .optional()
      .allow("")
      .error(errorsOverride),

    instaLink: Joi.string().min(3).optional().allow("").error(errorsOverride),
    twittwerLink: Joi.string()
      .min(3)
      .optional()
      .allow("")
      .error(errorsOverride),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().error(errorsOverride),
    newPassword: Joi.string().min(8).required().error(errorsOverride),
  }),

  contactUs: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
    description: Joi.string().min(8).required().error(errorsOverride),
  }),
};

export { ProviderValidations };
