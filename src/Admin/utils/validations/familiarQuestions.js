import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const questionValidationSchemas = {
  addQuestion: Joi.object({
    questionAr: Joi.string().min(10).required().error(errorsOverride),
    questionEn: Joi.string().min(10).required().error(errorsOverride),
    answerAr: Joi.string().required().error(errorsOverride),
    answerEn: Joi.string().required().error(errorsOverride),
    type: Joi.string()
      .valid("CLIENT", "PROVIDER")
      .required()
      .error(errorsOverride),
  }),
};

export { questionValidationSchemas };
