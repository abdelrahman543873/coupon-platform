import { number } from "@hapi/joi";
import mongoose from "mongoose";

let offerSchema = mongoose.Schema(
  {
    discount: {
      type: Number,
      required: true,
    },
    descAr: {
      type: String,
      required: true,
    },
    descEn: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["ALL", "ONE"],
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    imgURL: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let OfferModel = mongoose.model("Offers", offerSchema);

export { OfferModel };
