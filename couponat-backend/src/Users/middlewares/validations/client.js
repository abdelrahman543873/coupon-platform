import boom from "@hapi/boom";
import { ClientValidations } from "../../utils/validations/client";

const ClientValidationWares = {
  addClient(req, res, next) {
    const { error } = ClientValidations.addClient.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  addClientViaSocialMedia(req, res, next) {
    const { error } = ClientValidations.addClientViaSocialMedia.validate(
      req.body
    );

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  login(req, res, next) {
    const { error } = ClientValidations.login.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  socialAuth(req, res, next) {
    const { error } = ClientValidations.socialAuth.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  verifyMobile(req, res, next) {
    const { error } = ClientValidations.verifyMobile.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  updateProfile(req, res, next) {
    if (
      (req.body.mobile && !req.body.countryCode) ||
      (!req.body.mobile && req.body.countryCode)
    ) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Must enter both mobile and country code!"
            : "يجب إدخال رقم الهاتف مع رمز الدولة";
      return next(boom.badData(errMsg));
    }
    const { error } = ClientValidations.updateProfile.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },

  changePassword(req, res, next) {
    console.log(req.body);
    const { error } = ClientValidations.changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { ClientValidationWares };
