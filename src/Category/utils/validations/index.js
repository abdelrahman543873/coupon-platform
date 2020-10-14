import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).max(30).required().error(errorsOverride),
  english: Joi.string().min(3).max(30).required().error(errorsOverride),
});

const CategoryValidations = {
  add: Joi.object({
    name: langNameSchema,
  }),
};

export { CategoryValidations };
