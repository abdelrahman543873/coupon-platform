import boom from "@hapi/boom";
import { BankValidations } from "../utils/validations/bank";

let BankValidationWares = {
  async add(req, res, next) {
    const { error } = BankValidations.addBank.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },
};
export { BankValidationWares };
