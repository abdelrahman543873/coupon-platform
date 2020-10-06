import boom from "@hapi/boom";
import { OfferValidations } from "../../utils/validations/offers";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";

const OfferValidationWares = {
  async addOffer(req, res, next) {
    let lang = req.headers.lang || "ar",
      errMsg = "";
    let { error } = OfferValidations.addOffer.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    let bazar = await BazarModule.getById(req.body.bazar);
    if (!bazar) return next(boom.badData(error.details[0].message));

    if (bazar.type === "COUPONS_PROVIDER") {
      errMsg =
        lang == "en"
          ? "COUPON_PROVIDER not allawed"
          : "نوع البزار لا يجب ان يكون مزود كوبونات ";
      return next(boom.badData(errMsg));
    }

    if (bazar.isBazarAccepted === false) {
      errMsg =
        lang == "en"
          ? "Bazar must be Activated before"
          : "يجب تفعيل الحساب اولا";
      return next(boom.badData(errMsg));
    }
    if (req.body.product === "") delete req.body.product;
    if (req.body.type == "ONE" && !req.body.product) {
      errMsg = lang == "en" ? "Product id required" : "يجب اختيار منتج";
      return next(boom.badData(errMsg));
    }
    if (req.body.type == "ALL" && req.body.product) {
      errMsg = lang == "en" ? "Product id not required" : "المنتج غير مسموح به";
      return next(boom.badData(errMsg));
    }
    next();
  },
};
export { OfferValidationWares };
