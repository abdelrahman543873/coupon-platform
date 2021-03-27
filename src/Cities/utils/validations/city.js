import Joi from "joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const langNameSchema = Joi.object().keys({
  arabic: Joi.string().min(3).max(30).required().error(errorsOverride),
  english: Joi.string().min(3).max(30).required().error(errorsOverride),
});

const langNameSchemaUpdate = Joi.object()
  .keys({
    arabic: Joi.string().min(3).max(30).required().error(errorsOverride),
    english: Joi.string().min(3).max(30).required().error(errorsOverride),
  })
  .optional()
  .error(errorsOverride);

const locationSchema = Joi.object().keys({
  lat: Joi.number().min(-90).max(90).required().error(errorsOverride),
  long: Joi.number().min(-180).max(180).required().error(errorsOverride),
});

const locationSchemaUpdate = Joi.object()
  .keys({
    lat: Joi.number().min(-90).max(90).required().error(errorsOverride),
    long: Joi.number().min(-180).max(180).required().error(errorsOverride),
  })
  .optional()
  .error(errorsOverride);

const CityValidation = {
  addCity: Joi.object({
    name: langNameSchema,
    location: locationSchema,
  }),

  editCity: Joi.object({
    name: langNameSchemaUpdate,
    location: locationSchemaUpdate,
  }),
};

export { CityValidation };
