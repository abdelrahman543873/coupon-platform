import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider";

const ProviderValidationWares = {
  add(req, res, next) {
    console.log("midille");
    console.log(JSON.stringify(req.body));
    let location = [];
    if (req.body.lat.length != req.body.long.length) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Every City Must have specific location!"
            : "يجب اختيار موقع لكل مدينه";
      return next(boom.badData(errMsg));
    }
    for (let i = 0; i < req.body.lat.length; i++) {
      location.push({
        lat: req.body.lat[i],
        long: req.body.long[i],
      });
    }
    req.body.location = location;
    delete req.body.lat;
    delete req.body.long;
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

    if (req.body.cities && (!req.body.lat || !req.body.long)||(
      req.body.lat.length != req.body.long.length ||
      req.body.lat.length != req.body.cities.length
    )) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Every City Must have specific location!"
            : "يجب اختيار موقع لكل مدينه";
      return next(boom.badData(errMsg));
    }
    // if (
    //   req.body.lat.length != req.body.long.length ||
    //   req.body.lat.length != req.body.cities.length
    // ) {
    //   let lang = req.headers.lang || "ar",
    //     errMsg =
    //       lang == "en"
    //         ? "Every City Must have specific location!"
    //         : "يجب اختيار موقع لكل مدينه";
    //   return next(boom.badData(errMsg));
    // }

    if (req.body.cities) {
      let location = [];
      for (let i = 0; i < req.body.lat.length; i++) {
        location.push({
          lat: req.body.lat[i],
          long: req.body.long[i],
        });
      }
      req.body.location = location;
      delete req.body.lat;
      delete req.body.long;
    }

    const { error } = ProviderValidations.updateProvider.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
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
