import boom from "@hapi/boom";
import { AdsPayValidation } from "../../utils/validations/adsPayment";

let AdsPayValidationWare = {
  async add(req, res, next) {
    console.log("sadsa00", req.body);
    if (
      req.body.total > 0 &&
      (!req.body.paymentType || !req.body.transactionId || !req.body.accountId)
    ) {
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
    const { error } = AdsPayValidation.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { AdsPayValidationWare };
