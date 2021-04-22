import Joi from "joi";

export const AdminAddLocationsInput = Joi.object().keys({
  provider: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  locations: Joi.array()
    .items(
      Joi.array()
        .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
        .min(2)
        .max(2)
        .unique()
    )
    .unique()
    .required(),
});
