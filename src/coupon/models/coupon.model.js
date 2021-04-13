import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const coupon = mongoose.Schema(
  {
    enName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    arName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    enDescription: {
      type: String,
      required: true,
      trim: true,
    },
    arDescription: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
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
    category: {
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
    amount: { type: Number, required: true },
    logoURL: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
coupon.plugin(mongoosePaginate);
export const CouponModel = mongoose.model("Coupon", coupon);
