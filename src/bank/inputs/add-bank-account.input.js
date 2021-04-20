import Joi from "joi";

export const AddBankAccountInput = Joi.object({
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  agentName: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  swiftCode: Joi.string(),
});
