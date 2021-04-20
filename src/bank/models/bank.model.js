import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const bank = mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    swiftCode: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  }
);
bank.plugin(mongoosePaginate);
export const BankModel = mongoose.model("bank", bank);
