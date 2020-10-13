import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";


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

const CityValidation = {

  addCity: Joi.object({
    name: langNameSchema
  }),

  addDistrict: Joi.object({
    name: langNameSchema
  })
  
};


export { CityValidation };
