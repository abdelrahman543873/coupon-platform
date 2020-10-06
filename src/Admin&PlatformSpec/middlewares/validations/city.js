import boom from "@hapi/boom";
import { adminCityValidation } from "../../utils/validations/city";

const cityValidationware = {
  addCity(req, res, next) {
    let { error } = adminCityValidation.addCity.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
  addDistricts(req, res, next) {
    let { error } = adminCityValidation.addDistricts.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  }
};

export { cityValidationware }
