import Joi from "joi";

export const UpdateAdminInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(8).disallow(Joi.ref("newPassword")),
  newPassword: Joi.string().min(8),
  code: Joi.string()
    .when("phone", { then: Joi.string().required() })
    .when("email", { then: Joi.string().required() }),
})
  .with("password", "newPassword")
  .with("newPassword", "password");
