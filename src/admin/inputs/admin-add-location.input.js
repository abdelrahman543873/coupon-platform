import Joi from "joi";

export const AdminAddLocationInput = Joi.object().keys({
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  lat: Joi.number().min(-90).max(90).required(),
  long: Joi.number().min(-180).max(180).required(),
});
