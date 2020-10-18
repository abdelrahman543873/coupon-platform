import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

const passReqSchemas = {
  newPassMailReq: Joi.object({
    email: Joi.string().email().required().error(errorsOverride),
    isProvider: Joi.boolean().required(),
  }),
  newPassMobileReq: Joi.object({
    mobile: Joi.string().required().error(errorsOverride),
    isProvider: Joi.boolean().required(),
  }),
};

export { passReqSchemas }
