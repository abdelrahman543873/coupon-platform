import boom from "@hapi/boom";
import {
  addClientSchema,
  addMobileSchema,
  loginSchema,
  verifyMobileSchema,
  emailVerifivationSchema,
  socialLoginSchema,
  addClientViaSocialMediaSchema,
  socialAuth,
  updateProfile,
  changePassword,
} from "../../utils/validations/client";

const Validations = {
  addClient(req, res, next) {
    const { error } = addClientSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
  addClientViaSocialMedia(req, res, next) {
    const { error } = addClientViaSocialMediaSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  emailVerification(req, res, next) {
    const { error } = emailVerifivationSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  login(req, res, next) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  socialAuth(req, res, next) {
    const { error } = socialAuth.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
  addMobile(req, res, next) {
    const { error } = addMobileSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },
  verifyMobile(req, res, next) {
    const { error } = verifyMobileSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  updateProfile(req, res, next) {
    //let body={};
    if (!req.body.username) delete req.body.username;
    if (!req.body.email) delete req.body.email;
    if (!req.body.mobile) delete req.body.mobile;
    if (!req.body.countryCode) delete req.body.countryCode;
    if (!req.body.gender) delete req.body.gender;
    if (!req.body.deleteImg || req.body.deleteImg === "false")
      delete req.body.deleteImg;

      console.log("kaJASaJS");
    if (req.body === {}) return next(boom.badData(error.details[0].message));

    const { error } = updateProfile.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },

  changePassword(req, res, next) {
    console.log(req.body);
    const { error } = changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { Validations };
