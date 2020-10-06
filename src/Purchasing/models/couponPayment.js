import mongoose from "mongoose";
import shortid from "shortid";

let couponPaySchema = mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    code: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    paymentType: String,
    imgURL: String,
    note: String,
  },
  { timestamps: true, versionKey: false }
);

let CouponPayModel = mongoose.model("CouponsPayments", couponPaySchema);
export { CouponPayModel };
