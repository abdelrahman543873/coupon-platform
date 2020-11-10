import boom from "@hapi/boom";
import { CategoryModule } from "../../../Category/modules";
import { CouponValidations } from "../../utils/validations/coupon";

const CouponValidationWares = {
  async addCoupon(req, res, next) {
    console.log("here now");

    let name = {
      arabic: req.body.arabic,
      english: req.body.arabic,
    };
    delete req.body.arabic;
    delete req.body.english;
    req.body.name = name;

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
    const { error } = CouponValidations.updateCoupon.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { CouponValidationWares };
