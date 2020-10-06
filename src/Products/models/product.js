import mongoose from "mongoose";
import { OfferModel } from "./offers";

let productSchema = mongoose.Schema(
  {
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    bazarType: String,
    nameAr: {
      type: String,
      required: true,
    },
    nameEn: {
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
    productImages: [String],
    productCover: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    ratingCount: {
      type: Number,
      required: true,
      default: 0,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offers",
      get: checkExp,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

function checkExp(offer) {
  if (offer && !offer.isDeleted && new Date(offer.endDate) > new Date())
    return offer;
  else return null;
}

var autoPopulateLead = function (next) {
  this.populate("offer");
  next();
};
productSchema.set("toObject", { getters: true });
productSchema.set("toJSON", { getters: true });
productSchema.pre("findOne", autoPopulateLead);
productSchema.pre("find", autoPopulateLead);
productSchema.pre("lookup", autoPopulateLead);
productSchema.pre("populate", autoPopulateLead);
let ProductModel = mongoose.model("Product", productSchema);

export { ProductModel };
