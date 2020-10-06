import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const packageValidationSchemas = {
  addPackage: Joi.object({
    price: Joi.number().positive().allow(0).required().error(errorsOverride),
    totalDayes: Joi.number().positive().required().error(errorsOverride),
    descAr: Joi.string().min(3).required().error(errorsOverride),
    descEn: Joi.string().min(3).required().error(errorsOverride),
  }),
};

export { packageValidationSchemas };
