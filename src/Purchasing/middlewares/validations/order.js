import boom from "@hapi/boom";
import { OrderValidation } from "../../utils/validations/order";

let OrderValidationWare = {
  async addOrder(req, res, next) {
    delete req.body.authId;
    const {error} =OrderValidation.addOrder.validate(req.body);
    if (error) {
         return next(boom.badData(error.details[0].message));
        }
      next();
  },
};

export { OrderValidationWare };
