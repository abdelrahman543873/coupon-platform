import Joi from "joi";
export const AdminDeleteCategory = Joi.object({
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
