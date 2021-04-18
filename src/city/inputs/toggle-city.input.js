import Joi from "joi";

export const toggleCityInput = Joi.object({
  city: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
