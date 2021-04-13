import Joi from "joi";

export const SubscribeInput = Joi.object({
  coupon: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  paymentType: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  account: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  transactionId: Joi.string(),
});
