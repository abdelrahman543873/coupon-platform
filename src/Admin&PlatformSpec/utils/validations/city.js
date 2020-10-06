import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(errorsOverride),
  english: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(errorsOverride)
});

const adminCityValidation = {
  addCity: Joi.object({
    name: langNameSchema
  }),
  addDistricts: Joi.object({
    districts: Joi.array().items(
      Joi.object({
        name: langNameSchema
      })
    )
  })
};

const platformCityValidation = {};

export { adminCityValidation };
