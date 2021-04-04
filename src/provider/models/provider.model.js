import mongoose from "mongoose";

export const provider = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slogan: {
      type: String,
      required: true,
    },
    logoURL: { type: String },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    websiteLink: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    twitterLink: { type: String },
    fcmToken: { type: String },
    qrURL: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProviderModel = mongoose.model("Provider", provider);

export { ProviderModel };
