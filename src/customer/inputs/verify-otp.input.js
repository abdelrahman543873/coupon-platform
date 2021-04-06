import Joi from "joi";
export const VerifyOTPInput = Joi.object({
  code: Joi.string(),
});
