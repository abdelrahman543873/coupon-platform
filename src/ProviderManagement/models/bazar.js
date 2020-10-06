import mongoose from "mongoose";
import { boolean } from "@hapi/joi";

let bazarSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slogan: {
      type: String,
      required: true,
    },

    logoURL: String,
    officeTele: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["PRODUCTIVE_FAMILY", "BAZAR", "COUPONS_PROVIDER"],
      defualt: "BAZAR",
      required: true,
    },

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    districtId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      unique: true,
    },

    isBazarAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    rating: {
      type: Number,
      required: true,
      default: 5,
    },

    ratingCount: {
      type: Number,
      required: true,
      default: 0,
    },

    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
      },
    ],

    lat: String,
    lng: String,

    businessYearsNumber: {
      type: String,
      required: true,
    },

    paymentType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentType",
        required: true,
      },
    ],

    bankAccount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],

    creditCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credit",
    },

    websiteLink: String,
    facebookLink: String,
    instaLink: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let BazarModel = mongoose.model("Bazar", bazarSchema);

export { BazarModel };
