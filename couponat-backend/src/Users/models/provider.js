import mongoose from "mongoose";

let providerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    slogan: {
      type: String,
      required: true,
    },

    logoURL: String,

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "City",
        autopopulate: true,
      },
    ],

    districts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Districts",
        autopopulate: true,
      },
    ],

    lat: String,
    lng: String,

    officeTele: {
      type: String,
      required: true,
      unique: true,
    },

    websiteLink: String,
    facebookLink: String,
    instaLink: String,
    fcmToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

providerSchema.plugin(require("mongoose-autopopulate"));
let ProviderModel = mongoose.model("Provider", providerSchema);

export { ProviderModel };
