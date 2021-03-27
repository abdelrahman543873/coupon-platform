import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

let SubscriptionValidations = {
  subscripe: Joi.object({
    coupon: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
    provider: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
    paymentType: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
    account: Joi.custom(checkMongooseId, "custom validation")
      .optional()
      .error(errorsOverride),
    total: Joi.number().optional().positive().error(errorsOverride),
    transactionId: Joi.string().optional().error(errorsOverride),
  }),
};
export { SubscriptionValidations };
