import Joi from "joi";
import { TermsAndConditionsEnum } from "../terms-and-conditions.enum.js";

export const AddTermsAndConditionsInput = Joi.object().keys({
  enDescription: Joi.string().min(3).max(255).required(),
  arDescription: Joi.string().min(3).max(255).required(),
  key: Joi.string()
    .valid(...TermsAndConditionsEnum)
    .required(),
});
