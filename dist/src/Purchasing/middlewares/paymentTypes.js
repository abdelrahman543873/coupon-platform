import boom from "@hapi/boom";
import { PaymentValidaions } from "../utils/validations/paymentType.js";
let PaymentValidationWares = {
  async add(req, res, next) {
    const {
      error
    } = PaymentValidaions.add.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  }

};
export { PaymentValidationWares };