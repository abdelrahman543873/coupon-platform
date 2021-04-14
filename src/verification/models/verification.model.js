import mongoose from "mongoose";

let verification = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    code: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    phone: { type: String },
    email: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const VerificationModel = mongoose.model("Verification", verification);
