import boom from "@hapi/boom";
import { packageValidationSchemas } from "../../utils/validations/adsPackages";

const packageValidationnwar = {
  async addPackage(req, res, next) {
    const { error } = packageValidationSchemas.addPackage.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },
};

export { packageValidationnwar };
