import Joi from "joi";
export const UpdateCustomerInput = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
  password: Joi.string()
    .min(8)
    .when("newPassword", {
      then: Joi.string().min(8).disallow(Joi.ref("newPassword")).required(),
    }),
  code: Joi.string()
    .when("phone", { then: Joi.string().required() })
    .when("email", { then: Joi.string().required() }),
  newPassword: Joi.string().min(8),
});
