import boom from "@hapi/boom";
import { SubscriptionValidations } from "../utils/validations/subscription.js";
let SubscriptionValidationWares = {
  async subscripe(req, res, next) {
    const {
      error
    } = SubscriptionValidations.subscripe.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  }

};
export { SubscriptionValidationWares };