import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const BazarValidations = {
  addBazar: Joi.object({
    name: Joi.string().min(3).max(30).required().error(errorsOverride),

    slogan: Joi.string().required().min(3).error(errorsOverride),

    officeTele: Joi.string().required().min(5).error(errorsOverride),

    cityId: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    districtId: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .required()
        .error(errorsOverride)
    ),

    type: Joi.string()
      .valid("PRODUCTIVE_FAMILY", "BAZAR", "COUPONS_PROVIDER")
      .required()
      .error(errorsOverride),

    businessYearsNumber: Joi.string().required().error(errorsOverride),

    creditCard: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .error(errorsOverride),

    bankAccount: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .optional()
        .error(errorsOverride)
    ),

    paymentType: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .required()
        .error(errorsOverride)
    ),

    lat: Joi.string().allow("").optional().error(errorsOverride),
    lng: Joi.string().allow("").optional().error(errorsOverride),
    facebookLink: Joi.string().allow("").optional().error(errorsOverride),
    instaLink: Joi.string().allow("").optional().error(errorsOverride),
    websiteLink: Joi.string().allow("").optional().error(errorsOverride),
  }),

  editeBazarInfo: Joi.object({
    name: Joi.string().min(3).max(30).optional().error(errorsOverride),

    slogan: Joi.string().optional().min(3).error(errorsOverride),

    officeTele: Joi.string().optional().min(5).error(errorsOverride),

    businessYearsNumber: Joi.string().optional().error(errorsOverride),

    cityId: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .error(errorsOverride),

    districtId: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .optional()
        .error(errorsOverride)
    ),
    lat: Joi.string().optional().error(errorsOverride),
    lng: Joi.string().optional().error(errorsOverride),
    facebookLink: Joi.string().optional().error(errorsOverride),
    instaLink: Joi.string().optional().error(errorsOverride),
    websiteLink: Joi.string().optional().error(errorsOverride),
  }),

  addBank: Joi.object({
    accountNumber: Joi.string().required().error(errorsOverride),
    bankName: Joi.string().required().error(errorsOverride),
    bankAgentName: Joi.string().required().error(errorsOverride),
    city: Joi.string().required().error(errorsOverride),
    country: Joi.string().required().error(errorsOverride),
    bazar: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
    swiftCode: Joi.string().optional().allow(null).allow(""),
  }),

  addCredit: Joi.object({
    merchantEmail: Joi.string().required().error(errorsOverride),
    secretKey: Joi.string().required().error(errorsOverride),
    bazar: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
  }),

  editPayments: Joi.object({
    paymentType: Joi.array().items(
      Joi.custom(checkMongooseId, "custom validation")
        .required()
        .error(errorsOverride)
    ),
    bazar: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
  }),

  changeOrderState: Joi.object({
    state: Joi.string()
      .valid(
        "CONFIRMING PENDING",
        "REFUSED",
        "PAYMENT PENDING",
        "ACCEPTED",
        "SHIPPED TO USER ADDRESS",
        "DELIVERED"
      )
      .required()
      .error(errorsOverride),
  }),
};

export { BazarValidations };
