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
    totalCount: {
      type: Number,
      required: true,
    },
    subCount: {
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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    imgURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let CouponModel = mongoose.model("Coupon", couponSchema);
// export { CouponModel };
