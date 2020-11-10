import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider";

const ProviderValidationWares = {
  add(req, res, next) {
    console.log("midille");

    let { error } = ProviderValidations.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    if (!req.file) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "Please select logo to upload!" : "صورة الشعار مطلوبة";
      return next(boom.badData(errMsg));
    }
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
    console.log(req.body);
    const { error } = ProviderValidations.updateProvider.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },

  changePassword(req, res, next) {
    const { error } = ProviderValidations.changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { ProviderValidationWares };
