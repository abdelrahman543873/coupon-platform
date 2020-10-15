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

  // updateProfile(req, res, next) {
  //   //let body={};
  //   if (!req.body.username) delete req.body.username;
  //   if (!req.body.email) delete req.body.email;
  //   if (!req.body.mobile) delete req.body.mobile;
  //   if (!req.body.countryCode) delete req.body.countryCode;
  //   if (!req.body.gender) delete req.body.gender;
  //   if (!req.body.deleteImg || req.body.deleteImg === "false")
  //     delete req.body.deleteImg;

  //     console.log("kaJASaJS");
  //   if (req.body === {}) return next(boom.badData(error.details[0].message));

  //   const { error } = updateProfile.validate(req.body);

  //   if (error) {
  //     return next(boom.badData(error.details[0].message));
  //   }
  //   next();
  // },

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
