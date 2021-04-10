import Joi from "joi";
export const DeleteProviderInput = Joi.object({
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
