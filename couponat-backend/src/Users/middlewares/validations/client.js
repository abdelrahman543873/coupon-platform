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

  changeMobile(req, res, next) {
    const { error } = ClientValidations.changeMobile.validate(req.body);

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

  contactUs(req, res, next) {
    console.log(req.body);
    const { error } = ClientValidations.contactUs.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { ClientValidationWares };
