import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const AdsValidations = {
  add: Joi.object({
    bazarId: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    descriptionAr: Joi.string().required().min(10).error(errorsOverride),
    descriptionEn: Joi.string().required().min(10).error(errorsOverride),
    pakageId: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
  }),
};

export { AdsValidations };
