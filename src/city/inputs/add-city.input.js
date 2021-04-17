import Joi from "joi";
export const AddCityInput = Joi.object({
  enName: Joi.string().min(3).required(),
  arName: Joi.string().min(3).required(),
  area: Joi.array()
    .items(
      Joi.array()
        .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
        .min(2)
        .max(2)
        .unique()
    )
    .unique()
    .min(3)
    .required(),
});
