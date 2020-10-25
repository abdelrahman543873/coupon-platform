import boom from "@hapi/boom";
import { CouponValidations } from "../../utils/validations/coupon";

const CouponValidationWares = {
  async addCoupon(req, res, next) {
    console.log("here now");
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
    next();
  },

  async updateCoupon(req, res, next) {
    const { error } = CouponValidations.updateCoupon.validate(body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { CouponValidationWares };
