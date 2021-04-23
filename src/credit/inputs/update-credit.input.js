import Joi from "joi";
export const UpdateCreditInput = Joi.object({
  merchantEmail: Joi.string().email().optional(),
  secretKey: Joi.string().optional(),
}).or("merchantEmail", "secretKey");
