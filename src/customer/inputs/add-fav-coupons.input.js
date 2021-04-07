import Joi from "joi";

export const AddFavCouponsInput = Joi.object({
  coupons: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique(),
});
