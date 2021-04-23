import Joi from "joi";
export const AddTermsAndConditionsInput = Joi.object().keys({
  enDescription: Joi.string().min(3).max(255).required(),
  arDescription: Joi.string().min(3).max(255).required(),
});
