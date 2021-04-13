import mongoose from "mongoose";
import { PaymentEnum } from "../payment.enum.js";
import mongoosePaginate from "mongoose-paginate-v2";
let payment = mongoose.Schema(
  {
    enName: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
    },
    arName: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
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
payment.plugin(mongoosePaginate);
export const PaymentModel = mongoose.model("Payment", payment);
