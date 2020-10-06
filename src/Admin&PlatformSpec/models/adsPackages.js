import mongoose from "mongoose";

let adsPackageSchema = mongoose.Schema(
  {
    isActive:{
      type:Boolean,
      required:true,
      default:true
    },
    price: {
      type: Number,
      required: true,
    },
    totalDayes: {
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
  },
  {
    versionKey: false,
  }
);

let AdsPackagesModel = mongoose.model("AdsPackages", adsPackageSchema);

export { AdsPackagesModel };
