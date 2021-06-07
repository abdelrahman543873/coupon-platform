import Joi from "joi";
export const GetPaymentTypeInput = Joi.object({
  payment: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
