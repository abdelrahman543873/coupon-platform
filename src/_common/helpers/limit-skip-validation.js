import Joi from "joi";

export const offSetLimit = {
  offset: Joi.number().min(0),
  limit: Joi.number().min(1),
};

export const offSetLimitInput = Joi.object({
  offset: Joi.number().min(0),
  limit: Joi.number().min(1),
});
