import Joi from "joi";

export const toggleBankAccountInput = Joi.object({
  bank: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
