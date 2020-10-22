import boom from "@hapi/boom";
import { adminValidationSchemas } from "../../utils/validations/admin";

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
};

export { adminValidationwar };