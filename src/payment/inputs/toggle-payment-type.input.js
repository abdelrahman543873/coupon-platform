import Joi from "joi";

export const TogglePaymentTypeInput = Joi.object({
  paymentTypeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
