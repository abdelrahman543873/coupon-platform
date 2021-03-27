import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider.js";

const ProviderValidationWares = {
  add(req, res, next) {
    console.log("midille");
    console.log(JSON.stringify(req.body));

    let { error } = ProviderValidations.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    req.body.cities = req.body.cities.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    // for(let i=0;i<req.body.cities.length;i++){

    // }
    next();
  },

  login(req, res, next) {
    const { error } = ProviderValidations.login.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  emailVerification(req, res, next) {
    const { error } = ProviderValidations.email.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  updateProvider(req, res, next) {
    console.log("midille");
    console.log(JSON.stringify(req.body));
    console.log(req.body);

    const { error } = ProviderValidations.updateProvider.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    req.body.cities
      ? (req.body.cities = req.body.cities.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        ))
      : "";
    console.log(req.body);
    next();
  },

  changePassword(req, res, next) {
    const { error } = ProviderValidations.changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
  contactUs(req, res, next) {
    console.log(req.body);
    const { error } = ProviderValidations.contactUs.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { ProviderValidationWares };
