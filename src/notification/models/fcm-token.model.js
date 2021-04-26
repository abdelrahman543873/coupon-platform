import mongoose from "mongoose";

const token = mongoose.Schema(
  {
    fcmToken: String,
  },
  {
    versionKey: false,
  }
);

export const TokenModel = mongoose.model("Token", token);
