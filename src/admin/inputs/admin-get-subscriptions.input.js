import Joi from "joi";
import { PaymentEnum } from "../../payment/payment.enum.js";
import { offSetLimit } from "../../_common/helpers/limit-skip-validation.js";

export const AdminGetSubscriptionsInput = Joi.object({
  paymentType: Joi.string().valid(...PaymentEnum),
  provider: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  ...offSetLimit,
});
