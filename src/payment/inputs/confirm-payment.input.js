import Joi from "joi";

export const ConfirmPaymentInput = Joi.object({
  subscription: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
