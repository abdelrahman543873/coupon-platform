import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const OfferValidations = {
  addOffer: Joi.object({
    bazar: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
    descAr: Joi.string().min(10).required().error(errorsOverride),
    descEn: Joi.string().min(10).required().error(errorsOverride),
    type: Joi.string().required().valid("ALL", "ONE").error(errorsOverride),
    discount: Joi.number().positive().required().error(errorsOverride),
    product: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .allow("")
      .error(errorsOverride),
    totalDayes: Joi.number().positive().required().error(errorsOverride),
  }),
};

export { OfferValidations };
