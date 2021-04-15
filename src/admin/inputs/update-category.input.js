import Joi from "joi";
export const UpdateCategoryInput = Joi.object({
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  enName: Joi.string().min(3),
  arName: Joi.string().min(3),
  selected: Joi.string(),
  unSelected: Joi.string(),
}).or("enName", "arName");
