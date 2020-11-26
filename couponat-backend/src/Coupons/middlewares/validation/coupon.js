import boom from "@hapi/boom";
import { CategoryModule } from "../../../Category/modules";
import { CouponValidations } from "../../utils/validations/coupon";

const CouponValidationWares = {
  async addCoupon(req, res, next) {
    console.log("here now");

    let name = {
      arabic: req.body.nameAr,
      english: req.body.nameEn,
    };

    let description = {
      arabic: req.body.descAr,
      english: req.body.descEn,
    };
    delete req.body.nameAr;
    delete req.body.nameEn;
    delete req.body.descAr;
    delete req.body.descEn;
    req.body.name = name;

    console.log(req.body);
    console.log(typeof req.body.offerPrice);
    console.log(typeof req.body.servicePrice);
    if (parseInt(req.body.servicePrice) <= parseInt(req.body.offerPrice)) {
      let errMsg =
        lang == "en"
          ? "offer price must be less than service price"
          : "السعر بعد الخصم يجب ان يكون اقل من السعر قبل الخصم";
      return next(boom.notFound(errMsg));
    }
    req.body.description = description;
    let lang = req.headers.lang || "ar",
      errMsg =
        lang == "en"
          ? "Please select keyImage to upload!"
          : "صورة الكوبون مطلوبة";

    let category = await CategoryModule.getById(req.body.category);
    if (!category) {
      let errMsg = lang == "en" ? "Category not found" : "التصنيف غير موجود";
      return next(boom.notFound(errMsg));
    }
    let { error } = CouponValidations.addCoupon.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    if (!req.file) {
      return next(boom.badData(errMsg));
    }
    next();
  },

  async updateCoupon(req, res, next) {
    let name = {
      arabic: req.body.nameAr || null,
      english: req.body.nameEn || null,
    };

    let description = {
      arabic: req.body.descAr || null,
      english: req.body.descEn || null,
    };
    req.body.nameAr || req.body.nameEn ? (req.body.name = name) : "";
    req.body.descAr || req.body.descEn
      ? (req.body.description = description)
      : "";
    req.body.nameAr ? delete req.body.nameAr : "";
    req.body.nameEn ? delete req.body.nameEn : "";
    req.body.descAr ? delete req.body.descAr : "";
    req.body.descEn ? delete req.body.descEn : "";

    req.body.name && !req.body.name.arabic ? delete req.body.name.arabic : "";
    req.body.name && !req.body.name.english ? delete req.body.name.english : "";
    req.body.description && !req.body.description.arabic
      ? delete req.body.description.arabic
      : "";
    req.body.description && !req.body.description.english
      ? delete req.body.description.english
      : "";

    console.log(req.body.name);
    console.log(req.body.description);
    const { error } = CouponValidations.updateCoupon.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { CouponValidationWares };
