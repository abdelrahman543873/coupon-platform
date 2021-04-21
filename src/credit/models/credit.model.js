import mongoose from "mongoose";

const credit = mongoose.Schema(
  {
    merchantEmail: {
      type: String,
      required: true,
      unique: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const CreditModel = mongoose.model("Credit", credit);
