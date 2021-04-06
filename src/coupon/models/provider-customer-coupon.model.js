import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const providerCustomerCoupon = mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
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
