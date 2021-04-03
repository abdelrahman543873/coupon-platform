import Joi from "joi";
export const SocialLoginInput = Joi.object({
  socialMediaId: Joi.string(),
});
