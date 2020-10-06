import mongoose from "mongoose";

let adSchema = mongoose.Schema(
  {
    descriptionAr: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    adURL: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    pakageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdsPackages",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdsPayments",
    },
    note: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let AdsModel = mongoose.model("Advertisement", adSchema);

export { AdsModel };
