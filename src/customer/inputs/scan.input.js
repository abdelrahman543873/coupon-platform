import Joi from "joi";
export const ScanInput = Joi.object({
  code: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
