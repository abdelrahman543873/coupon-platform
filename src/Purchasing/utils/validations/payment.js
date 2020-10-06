import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const PaymentValidation = {
  addPayment: Joi.object({
    order: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    type: Joi.string().required().error(errorsOverride),

    total: Joi.number().required().positive().error(errorsOverride),

    transactionId: Joi.string().required().error(errorsOverride),

    accountId: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),
  }),
};
export { PaymentValidation };
