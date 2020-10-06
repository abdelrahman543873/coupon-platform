import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const questionValidationSchemas = {
  addQuestion: Joi.object({
    question: Joi.string().min(10).required().error(errorsOverride),
    answer: Joi.string().required().error(errorsOverride),
    type: Joi.string()
      .valid("CLIENT", "PROVIDER")
      .required()
      .error(errorsOverride),
    lang: Joi.string()
      .valid("en", "ar")
      .required()
      .error(errorsOverride),
  }),
};

export { questionValidationSchemas };
