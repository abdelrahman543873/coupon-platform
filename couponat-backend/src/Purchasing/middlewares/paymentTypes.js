import boom from "@hapi/boom";
import { PaymentValidaions } from "../utils/validations/paymentType";

let PaymentValidationWares = {
  async add(req, res, next) {
    if (!req.file) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Please select Payment Type image to upload!"
            : "صورة طريقة الدفع مطلوبة";
      return next(boom.badData(errMsg));
    }
    const { error } = PaymentValidaions.add.validate(req.body);
    if (error) return next(boom.badData(error.details[0].message));
    next();
  },
};
export { PaymentValidationWares };
