import Joi from "joi";
export const AddCategoryInput = Joi.object({
  enName: Joi.string().min(3).required(),
  arName: Joi.string().min(3).required(),
});
