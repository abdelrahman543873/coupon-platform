import boom from "@hapi/boom";
import { CouponPayValidation } from "../../utils/validations/couponPayment";

let CouponPayValidationWare = {
  async add(req, res, next) {
    delete req.body.authId;
    console.log("sadsa00", req.body);
    if (req.body.price > 0 && (!paymentType || !transactionId || !accountId)) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "data is not completed!" : "الداتا غير مكتملة";
      return next(boom.badData(errMsg));
    }
    if (!req.body.paymentType) delete req.body.paymentType;
    if (!req.body.transactionId) delete req.body.transactionId;
    if (!req.body.accountId) delete req.body.accountId;
    if (!req.body.imgURL) delete req.body.imgURL;
    if (
      req.body.paymentType &&
      req.body.paymentType == "BANK_TRANSFER" &&
      !req.file
    ) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Must upload transaction screen shot!"
            : "يجب ادراج صورة عملية التحويل";
      return next(boom.unauthorized(errMsg));
    }
    const { error } = CouponPayValidation.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { CouponPayValidationWare };
