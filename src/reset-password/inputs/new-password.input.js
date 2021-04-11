import Joi from "joi";
export const ChangePasswordInput = Joi.object({
  newPassword: Joi.string().min(8).required(),
});
