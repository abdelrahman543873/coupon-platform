import Joi from "joi";
export const AddCreditInput = Joi.object({
  merchantEmail: Joi.string().email().required(),
  secretKey: Joi.string().required(),
});
