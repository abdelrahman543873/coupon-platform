import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const coupon = mongoose.Schema(
  {
    name: {
      arabic: {
        type: String,
        required: true,
        trim: true,
      },
      english: {
        type: String,
        required: true,
        trim: true,
      },
    },
    description: {
      arabic: {
        type: String,
        required: true,
        trim: true,
      },
      english: {
        type: String,
        required: true,
        trim: true,
      },
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    imgURL: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
coupon.plugin(mongoosePaginate);
export const CouponModel = mongoose.model("Coupon", coupon);
