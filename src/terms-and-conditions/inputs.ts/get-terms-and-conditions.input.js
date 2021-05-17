import Joi from "joi";
import { TermsAndConditionsEnum } from "../terms-and-conditions.enum.js";

export const GetTermsAndConditionsInput = Joi.object({
  key: Joi.string()
    .valid(...TermsAndConditionsEnum)
    .required(),
});
