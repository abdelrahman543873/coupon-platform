import boom from "@hapi/boom";
import { CityValidation } from "../../utils/validations/city.js";
const cityValidationware = {
  addCity(req, res, next) {
    let {
      error
    } = CityValidation.addCity.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  async update(req, res, next) {
    let {
      error
    } = CityValidation.editCity.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  }

};
export { cityValidationware };