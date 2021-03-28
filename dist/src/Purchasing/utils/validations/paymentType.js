import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding.js";
const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).required().error(errorsOverride),
  english: Joi.string().min(3).required().error(errorsOverride)
});
let PaymentValidaions = {
  add: Joi.object({
    name: langNameSchema,
    key: Joi.string().valid("ONLINE_PAYMENT", "BANK_TRANSFER", "CASH").required().error(errorsOverride)
  })
};
export { PaymentValidaions };