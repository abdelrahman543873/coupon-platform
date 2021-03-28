import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding.js";
let BankValidations = {
  addBank: Joi.object({
    accountNumber: Joi.string().required().error(errorsOverride),
    bankName: Joi.string().required().error(errorsOverride),
    agentName: Joi.string().required().error(errorsOverride),
    city: Joi.string().required().error(errorsOverride),
    country: Joi.string().required().error(errorsOverride),
    swiftCode: Joi.string().optional().allow(null).allow("")
  })
};
export { BankValidations };