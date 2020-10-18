import mongoose from "mongoose";

let paymentTypeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    imgURL: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

let PeymentTypeModel = mongoose.model("PaymentType", paymentTypeSchema);

export { PeymentTypeModel };
