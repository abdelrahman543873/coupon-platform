import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const OrderValidation = {
  addOrder: Joi.object({
    bazar: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    paymentType: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    deliveryAddress: Joi.custom(checkMongooseId, "custom validation")
      .required()
      .error(errorsOverride),

    products: Joi.array().items(
      Joi.object({
        product: Joi.custom(checkMongooseId, "custom validation")
          .required()
          .error(errorsOverride),

        quantity: Joi.number().positive().error(errorsOverride),
      })
    ),

    total: Joi.number().positive().error(errorsOverride),
  }),
};

export { OrderValidation };
