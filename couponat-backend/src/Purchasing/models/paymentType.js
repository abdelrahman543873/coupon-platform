import mongoose from "mongoose";

let paymentTypeSchema = mongoose.Schema(
  {
    name: {
      english: {
        type: String,
        required: true,
      },
      arabic: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    key: {
      type: String,
      required: true,
      enum: ["ONLINE_PAYMENT", "BANK_TRANSFER", "CASH"],
    },
  },
  {
    versionKey: false,
  }
);

let PeymentTypeModel = mongoose.model("PaymentType", paymentTypeSchema);

export { PeymentTypeModel };
