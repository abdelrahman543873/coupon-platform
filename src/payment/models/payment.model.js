import mongoose from "mongoose";
import { PaymentEnum } from "../payment.enum.js";
let payment = mongoose.Schema(
  {
    enName: {
      type: String,
      required: true,
    },
    arName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    key: {
      type: String,
      required: true,
      enum: PaymentEnum,
    },
  },
  {
    versionKey: false,
  }
);

export const PaymentModel = mongoose.model("Payment", payment);
