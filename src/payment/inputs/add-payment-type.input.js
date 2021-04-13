import Joi from "joi";
import { PaymentEnum } from "../payment.enum.js";

export const AddPaymentTypeInput = Joi.object({
  enName: Joi.string().min(3).max(30).required(),
  arName: Joi.string().min(3).max(30).required(),
  key: Joi.string()
    .valid(...PaymentEnum)
    .required(),
});
