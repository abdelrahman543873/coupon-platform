import boom from "@hapi/boom";
import { adminValidationSchemas } from "../../utils/validations/admin.js";

const adminValidationwar = {
  async add(req, res, next) {
    const { error } = adminValidationSchemas.add.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },
  async login(req, res, next) {
    const { error } = adminValidationSchemas.login.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },

  async addBank(req, res, next) {
    let { error } = adminValidationSchemas.addBank.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  async mailReply(req, res, next) {
    let { error } = adminValidationSchemas.mailReply.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  async resetPass(req, res, next) {
    let { error } = adminValidationSchemas.resetPass.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  async editCriditCard(req, res, next) {
    console.log(req.body);
    if (!req.body.merchantEmail && !req.body.secretKey) {
      return next(boom.badData("No Data to Update"));
    }
    let { error } = adminValidationSchemas.editCriditCard.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  changePassword(req, res, next) {
    console.log(req.body);
    const { error } = adminValidationSchemas.changePassword.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },

  changeEmail(req, res, next) {
    console.log(req.body);
    const { error } = adminValidationSchemas.changeEmail.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { adminValidationwar };
