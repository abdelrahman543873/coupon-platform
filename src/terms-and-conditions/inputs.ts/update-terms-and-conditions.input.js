import Joi from "joi";
import { TermsAndConditionsEnum } from "../terms-and-conditions.enum.js";
export const UpdateTermsAndConditionsInput = Joi.object().keys({
  enDescription: Joi.string().min(3),
  arDescription: Joi.string().min(3),
  key: Joi.string()
    .valid(...TermsAndConditionsEnum)
    .required(),
});
