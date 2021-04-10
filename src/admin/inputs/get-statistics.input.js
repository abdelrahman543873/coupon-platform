import Joi from "joi";
export const GetStatisticsInput = Joi.object({
  filtrationDate: Joi.date().iso().optional(),
});
