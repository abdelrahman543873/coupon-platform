import mongoose from "mongoose";
import shortid from "shortid";

let adsPaySchema = mongoose.Schema(
  {
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement",
      required: true,
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    code: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentType: String,
    accountIdL: mongoose.Schema.Types.ObjectId,
    imgURL: String,
  },
  { timestamps: true, versionKey: false }
);

let AdsPayModel = mongoose.model("AdsPayments", adsPaySchema);
export { AdsPayModel };
