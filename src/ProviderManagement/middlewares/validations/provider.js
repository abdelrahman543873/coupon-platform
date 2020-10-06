import boom from "@hapi/boom";
import { ProviderValidations } from "../../utils/validations/provider";
import { optional } from "@hapi/joi";
import { BazarValidations } from "../../utils/validations/bazar";

const ProviderValidationWares = {
  add(req, res, next) {
    console.log(req.body);
    if (typeof req.body.roles === "string") {
      let rolesArr = [];
      rolesArr.push(req.body.roles);
      req.body.roles = rolesArr;
    }
    let { error } = ProviderValidations.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
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
  mobileVerification(req, res, next) {
    const { error } = ProviderValidations.mobileVerification.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  updateProviderPersonal(req, res, next) {
    //let body={};
    if (!req.body.username) delete req.body.username;
    if (!req.body.email) delete req.body.email;
    if (!req.body.phone) delete req.body.phone;
    if (!req.body.countryCode) delete req.body.countryCode;
    if (!req.body.gender) delete req.body.gender;
    if (!req.body.roles) delete req.body.roles;
    if (!req.body.deleteImg || req.body.deleteImg==="false") delete req.body.deleteImg;

    if (req.body.roles && typeof req.body.roles === "string") {
      let rolesArr = [];
      rolesArr.push(req.body.roles);
      req.body.roles = rolesArr;
    }
    if (req.body === {}) return next(boom.badData(error.details[0].message));

    const { error } = ProviderValidations.updateProviderPersonal.validate(
      req.body
    );

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
  changePassword(req, res, next) {
    console.log(req.body);
    const { error } = ProviderValidations.changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { ProviderValidationWares };
