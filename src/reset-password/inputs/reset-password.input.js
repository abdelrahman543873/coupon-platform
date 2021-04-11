import Joi from "joi";
export const ResetPasswordInput = Joi.object({
  email: Joi.string().email().lowercase(),
  phone: Joi.string().min(7),
  code: Joi.number().min(4),
  newPassword: Joi.string()
    .min(8)
    .when("code", { then: Joi.string().min(8).required() }),
}).or("email", "phone");
