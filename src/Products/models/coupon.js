import mongoose from "mongoose";
import { boolean } from "@hapi/joi";

let couponSchema = mongoose.Schema(
  {
    titleAr: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    keyImageURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let CouponModel = mongoose.model("coupon", couponSchema);
export { CouponModel };
