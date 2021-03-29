import mongoose from "mongoose";

const provider = mongoose.Schema(
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
    code: {
      type: String,
      required: true,
      unique: true,
    },
    officeTele: {
      type: String,
      required: true,
    },

    websiteLink: String,
    facebookLink: String,
    instagramLink: String,
    twitterLink: String,
    fcmToken: String,
    qrURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProviderModel = mongoose.model("Provider", provider);

export { ProviderModel };
