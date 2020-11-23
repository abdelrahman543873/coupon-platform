import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider";

const ProviderValidationWares = {
  add(req, res, next) {
    console.log("midille");
    console.log(JSON.stringify(req.body));
    //req.body= JSON.parse(req.body);
    if (!req.body.location) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Evry City Must have specific location!"
            : "يجب اختيار موقع لكل مدينه";
      return next(boom.badData(errMsg));
    }
    if (req.body.cities.length != req.body.location.length) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Evry City Must have specific location!"
            : "يجب اختيار موقع لكل مدينه";
      return next(boom.badData(errMsg));
    }
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
    console.log("midille");
    console.log(JSON.stringify(req.body));
    console.log(req.body);

    if (
      req.body.cities &&
      (!req.body.location || req.body.cities.length != req.body.location.length)
    ) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Evry City Must have specific location!"
            : "يجب اختيار موقع لكل مدينه";
      return next(boom.badData(errMsg));
    }

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
