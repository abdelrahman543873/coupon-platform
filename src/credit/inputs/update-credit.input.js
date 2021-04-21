import Joi from "joi";
export const UpdateCreditInput = Joi.object({
  credit: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  merchantEmail: Joi.string().email().optional(),
  secretKey: Joi.string().optional(),
}).or("merchantEmail", "secretKey");
