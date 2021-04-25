import Joi from "joi";
export const ChangePhoneInput = Joi.object({
  phone: Joi.string()
    .regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .required(),
});
