import mongoose from "mongoose";

let verificationSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let VerificationModel = mongoose.model("Verification", verificationSchema);

export { VerificationModel };
