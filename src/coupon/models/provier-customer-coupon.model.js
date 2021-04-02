import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const providerCustomerCoupon = mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
providerCustomerCoupon.plugin(mongoosePaginate);
export const providerCustomerCouponModel = mongoose.model(
  "ProviderCustomerCoupon",
  providerCustomerCoupon
);
