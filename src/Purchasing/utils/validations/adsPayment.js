import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const AdsPayValidation = {
  add: Joi.object({
    adId: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    total: Joi.number().positive().allow(0).error(errorsOverride),

    paymentType: Joi.string().optional().allow(null).error(errorsOverride),

    transactionId: Joi.string().optional().allow(null).error(errorsOverride),

    accountId: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .allow(null)
      .error(errorsOverride),
  }),
};
export { AdsPayValidation };
