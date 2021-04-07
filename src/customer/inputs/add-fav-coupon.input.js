import Joi from "joi";

export const AddFavCouponInput = Joi.object({
  coupon: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
