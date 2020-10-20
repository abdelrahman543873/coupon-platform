import mongoose from "mongoose";

let couponSchema = mongoose.Schema(
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
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      autopopulate: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    sellCount: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      autopopulate: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    imgURL: String,
    qrURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

couponSchema.plugin(require("mongoose-autopopulate"));
let CouponModel = mongoose.model("Coupon", couponSchema);
export { CouponModel };
