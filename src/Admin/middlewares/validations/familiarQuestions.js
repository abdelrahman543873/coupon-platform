import boom from "@hapi/boom";
import { questionValidationSchemas } from "../../utils/validations/familiarQuestions";

const questionValidationwar = {
  async addQuestion(req, res, next) {
    const { error } = questionValidationSchemas.addQuestion.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },
};

export { questionValidationwar };
