import mongoose from "mongoose";

const verification = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// export const VerificationModel = mongoose.model("Verification", verification);
