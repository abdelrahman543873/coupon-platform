import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).max(30).required().error(errorsOverride),
  english: Joi.string().min(3).max(30).required().error(errorsOverride),
});

const updatelangNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).optional().error(errorsOverride),
  english: Joi.string().min(3).optional().error(errorsOverride),
});

const CategoryValidations = {
  add: Joi.object({
    name: langNameSchema,
  }),

  edit: Joi.object({
    name: updatelangNameSchema,
  }),
};

export { CategoryValidations };
