import mongoose from "mongoose";

let subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      autopopulate: true,
    },
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentType",
      required: true,
      autopopulate: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      autopopulate: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      required: true,
    },
    total: {
      type: Number,
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
    imgURL: String,
    qrURL: String,
    note: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

subscriptionSchema.plugin(require("mongoose-autopopulate"));
let SubscripionModel = mongoose.model("Subscription", subscriptionSchema);
export { SubscripionModel };
