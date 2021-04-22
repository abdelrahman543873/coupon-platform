import Joi from "joi";

export const adminGetProviderInput = Joi.object({
  provider: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
