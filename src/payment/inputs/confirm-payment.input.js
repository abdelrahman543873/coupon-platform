import Joi from "joi";

export const ConfirmPaymentInput = Joi.object({
  subscription: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  arMessage: Joi.string(),
  enMessage: Joi.string(),
})
  .with("arMessage", "enMessage")
  .with("enMessage", "arMessage");
