import mongoose from "mongoose";

let bankSchema = mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique:true
    },
    bankName: {
      type: String,
      required: true,
    },
    bankAgentName: {
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
    
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  }
);

let BankModel = mongoose.model("Bank", bankSchema);

export { BankModel };
