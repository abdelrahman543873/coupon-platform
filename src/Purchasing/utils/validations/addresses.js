import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const addAddressSchema = Joi.object({
  city: Joi.string()
    .required()
    .min(3)
    .error(errorsOverride),
  district: Joi.string()
    .required()
    .min(3)
    .error(errorsOverride),
  street: Joi.string()
    .required()
    .min(3)
    .error(errorsOverride),
  addressName: Joi.string()
    .required()
    .min(3)
    .error(errorsOverride),
  buildingNo: Joi.string()
    .min(1)
    .error(errorsOverride),
  floorNo: Joi.string()
    .min(1)
    .error(errorsOverride),
  isMainAddress: Joi.boolean().error(errorsOverride),
  lat: Joi.number()
    .required()
    .error(errorsOverride),
  lng: Joi.number()
    .required()
    .error(errorsOverride)
});

const editAddressSchema = Joi.object({
  city: Joi.string().optional().min(3).error(errorsOverride),
  district: Joi.string().optional().min(3).error(errorsOverride),
  street: Joi.string().optional().min(3).error(errorsOverride),
  addressName: Joi.string().optional().min(3).error(errorsOverride),
  buildingNo: Joi.string().min(1).error(errorsOverride),
  floorNo: Joi.string().min(1).error(errorsOverride),
  lat: Joi.number().optional().error(errorsOverride),
  lng: Joi.number().optional().error(errorsOverride),
});

export { addAddressSchema, editAddressSchema };
