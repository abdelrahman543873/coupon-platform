import mongoose from "mongoose";

let paymentSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    isRefused: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
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
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imgURL: String,
  },
  { timestamps: true, versionKey: false }
);

let PaymentModel = mongoose.model("Payment", paymentSchema);

export { PaymentModel };
