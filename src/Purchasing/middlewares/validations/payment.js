import { PaymentValidation } from "../../utils/validations/payment";
import boom from "@hapi/boom";

const PaymentValidationWare = {
  async addPayment(req, res, next) {
    delete req.body.authId;
    let payment = req.body;

    if (payment.type == "BANK_TRANSFER" && !req.file) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Must upload transaction screen shot!"
            : "يجب ادراج صورة عملية التحويل";
      return next(boom.unauthorized(errMsg));
    }
    const { error } = PaymentValidation.addPayment.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { PaymentValidationWare };
