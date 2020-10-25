import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).required().error(errorsOverride),
  english: Joi.string().min(3).required().error(errorsOverride),
});

const updatelangNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).optional().error(errorsOverride),
  english: Joi.string().min(3).optional().error(errorsOverride),
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

  updateCoupon: Joi.object({
    name: updatelangNameSchema,
    description: updatelangNameSchema,
    servicePrice: Joi.number().optional().positive().error(errorsOverride),
    offerPrice: Joi.number().optional().positive().error(errorsOverride),
    totalCount: Joi.number().optional().positive().error(errorsOverride),
    category: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .error(errorsOverride),
  }),
};

export { CouponValidations };
