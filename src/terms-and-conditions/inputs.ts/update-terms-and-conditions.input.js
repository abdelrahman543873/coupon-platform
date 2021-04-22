import Joi from "joi";
export const UpdateTermsAndConditionsInput = Joi.object()
  .keys({
    termsAndConditions: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    enDescription: Joi.string().min(3).max(255),
    arDescription: Joi.string().min(3).max(255),
  })
  .or("enDescription", "arDescription");
