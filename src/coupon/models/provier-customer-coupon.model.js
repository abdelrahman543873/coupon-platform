import mongoose from "mongoose";
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
export const providerCustomerCouponModel = mongoose.model(
  "ProviderCustomerCoupon",
  providerCustomerCoupon
);
