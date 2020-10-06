import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";

let date = new Date();

const CouponValidations = {
  addCoupon: Joi.object({
    bazar: Joi.string().required().error(errorsOverride),
    titleEn: Joi.string().min(3).max(100).required().error(errorsOverride),
    titleAr: Joi.string().min(3).max(100).required().error(errorsOverride),
    descriptionEn: Joi.string().min(10).required().error(errorsOverride),
    descriptionAr: Joi.string().min(10).required().error(errorsOverride),
    discount: Joi.number().required().positive().error(errorsOverride),
    price: Joi.number().required().positive().error(errorsOverride).allow(0),
    expirationDate: Joi.date().required().min(date),
  }),
  updateCoupon: Joi.object({
    titleEn: Joi.string().min(3).max(100).optional().error(errorsOverride),
    titleAr: Joi.string().min(3).max(100).optional().error(errorsOverride),
    descriptionEn: Joi.string().min(10).optional().error(errorsOverride),
    descriptionAr: Joi.string().min(10).optional().error(errorsOverride),
    discount: Joi.number().optional().positive().error(errorsOverride),
    price: Joi.number().optional().positive().error(errorsOverride).allow(0),
    expirationDate: Joi.date().optional().min(date),
  }),
};

export { CouponValidations };
