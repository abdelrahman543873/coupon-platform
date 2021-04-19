import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const providerCustomerCoupon = mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
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
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    image: { type: String },
    total: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
providerCustomerCoupon.plugin(mongoosePaginate);
providerCustomerCoupon.plugin(aggregatePaginate);
export const providerCustomerCouponModel = mongoose.model(
  "ProviderCustomerCoupon",
  providerCustomerCoupon
);
