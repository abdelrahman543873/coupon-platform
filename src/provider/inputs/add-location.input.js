import Joi from "joi";

export const AddLocationInput = Joi.object().keys({
  lat: Joi.number().min(-90).max(90).required(),
  long: Joi.number().min(-180).max(180).required(),
});
