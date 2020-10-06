import boom from "@hapi/boom";
import { passReqSchemas } from "../../utils/validations/passReq";

const passReqValidationware = {
  async newPassMailReq(req, res, next) {
    let { error } = passReqSchemas.newPassMailReq.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
  async newPassMobileReq(req, res, next) {
    let { error } = passReqSchemas.newPassMobileReq.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
};

export { passReqValidationware };
