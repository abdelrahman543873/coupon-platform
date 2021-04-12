import Joi from "joi";
export const UpdateCustomerInput = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().min(7).optional(),
  password: Joi.string()
    .min(8)
    .when("phone", { then: Joi.string().min(8).required() })
    .when("email", { then: Joi.string().min(8).required() })
    .when("newPassword", {
      then: Joi.string().min(8).disallow(Joi.ref("newPassword")).required(),
    }),
  newPassword: Joi.string().min(8),
});
