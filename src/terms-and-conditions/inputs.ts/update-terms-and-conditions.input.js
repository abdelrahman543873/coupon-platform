import Joi from "joi";
import { TermsAndConditionsEnum } from "../terms-and-conditions.enum.js";
export const UpdateTermsAndConditionsInput = Joi.object().keys({
  termsAndConditions: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  enDescription: Joi.string().min(3).max(255),
  arDescription: Joi.string().min(3).max(255),
  key: Joi.string().valid(...TermsAndConditionsEnum),
});
