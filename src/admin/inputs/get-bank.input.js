import Joi from "joi";
export const GetBankInput = Joi.object({
  bank: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
