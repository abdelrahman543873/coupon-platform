import mongoose from "mongoose";
import { socialMediaEnum } from "../social-media-type.enum.js";

const customer = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSocialMediaVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    socialMediaId: {
      type: String,
      unique: true,
    },
    socialMediaType: {
      type: String,
      enum: socialMediaEnum,
    },
    favCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    fcmToken: { type: String },
    profilePictureURL: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CustomerModel = mongoose.model("Customer", customer);
