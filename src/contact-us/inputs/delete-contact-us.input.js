import Joi from "joi";
export const DeleteContactUsInput = Joi.object({
  contactUsMessage: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
