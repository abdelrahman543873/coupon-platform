import boom from "@hapi/boom";
import { ClientValidations } from "../../utils/validations/client.js";
const ClientValidationWares = {
  addClient(req, res, next) {
    const {
      error
    } = ClientValidations.addClient.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  socialLogin(req, res, next) {
    const {
      error
    } = ClientValidations.socialLogin.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  login(req, res, next) {
    const {
      error
    } = ClientValidations.login.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  socialRegister(req, res, next) {
    const {
      error
    } = ClientValidations.socialRegister.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  verifyMobile(req, res, next) {
    const {
      error
    } = ClientValidations.verifyMobile.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  changeMobile(req, res, next) {
    const {
      error
    } = ClientValidations.changeMobile.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  changePassword(req, res, next) {
    console.log(req.body);
    const {
      error
    } = ClientValidations.changePassword.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  contactUs(req, res, next) {
    console.log(req.body);
    const {
      error
    } = ClientValidations.contactUs.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  }

};
export { ClientValidationWares };