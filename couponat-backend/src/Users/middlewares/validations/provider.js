import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider";

const ProviderValidationWares = {
  add(req, res, next) {
    typeof req.body.cities == "string"
      ? (req.body.cities = [req.body.cities])
      : "";
    typeof req.body.districts == "string"
      ? (req.body.districts = [req.body.districts])
      : "";

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
    req.body.cities && typeof req.body.cities == "string"
      ? (req.body.cities = [req.body.cities])
      : "";
    req.body.districts && typeof req.body.districts == "string"
      ? (req.body.districts = [req.body.districts])
      : "";
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
