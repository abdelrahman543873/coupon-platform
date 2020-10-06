import boom from "@hapi/boom";
import { CouponValidations } from "../../utils/validations/coupon";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";

const CouponValidationWares = {
  async addCoupon(req, res, next) {
    let lang = req.headers.lang || "ar",
      errMsg =
        lang == "en"
          ? "Please select keyImage to upload!"
          : "صورة الكوبون مطلوبة";
    let { error } = CouponValidations.addCoupon.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    if (!req.file) {
      return next(boom.badData(errMsg));
    }

    let bazar = await BazarModule.getById(req.body.bazar);
    if (!bazar) return next(boom.badData(error.details[0].message));

    if (bazar.type !== "COUPONS_PROVIDER") {
      errMsg =
        lang == "en"
          ? "Bazar Type must be COUPON_PROVIDER"
          : "نوع البزار يجب ان يكون مزود كوبونات ";
      return next(boom.badData(errMsg));
    }

    if (bazar.isBazarAccepted === false) {
      errMsg =
        lang == "en"
          ? "Bazar must be Activated before"
          : "يجب تفعيل الحساب اولا";
      return next(boom.badData(errMsg));
    }
    next();
  },
  async updateCoupon(req, res, next) {
    if (!req.body.titleEn) delete req.body.titleEn;
    if (!req.body.titleAr) delete req.body.titleAr;
    if (!req.body.descriptionEn) delete req.body.descriptionEn;
    if (!req.body.descriptionAr) delete req.body.descriptionAr;
    if (!req.body.discount) delete req.body.discount;
    if (!req.body.price) delete req.body.price;
    if (!req.body.expirationDate) delete req.body.expirationDate;
    if (!req.body.keyImg) delete req.body.keyImg;

    if (req.body === {}) return next(boom.badData(error.details[0].message));
    let body = Object.create(req.body);
    delete body.bazar;
    const { error } = CouponValidations.updateCoupon.validate(body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { CouponValidationWares };
