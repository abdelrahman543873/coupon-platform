import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).max(30).required().error(errorsOverride),
  english: Joi.string().min(3).max(30).required().error(errorsOverride),
});

const CouponValidations = {
  addCoupon: Joi.object({
    name: langNameSchema,
    description: langNameSchema,
    servicePrice: Joi.number().required().positive().error(errorsOverride),
    offerPrice: Joi.number().required().positive().error(errorsOverride),
    totalCount: Joi.number().required().positive().error(errorsOverride),
    category: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
  }),
};

export { CouponValidations };
