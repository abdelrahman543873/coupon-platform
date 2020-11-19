import mongoose from "mongoose";

let providerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      default: false,
    },
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "City",
        autopopulate: true,
      },
    ],
    location: [
      {
        _id: false,
        lat: {
          type: String,
          required: true,
        },
        long: {
          type: String,
          required: true,
        },
      },
    ],
    officeTele: {
      type: String,
      required: true,
    },

    websiteLink: String,
    facebookLink: String,
    instaLink: String,
    twittwerLink: String,
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
