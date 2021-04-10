import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export const provider = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      unique: true,
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
provider.plugin(mongoosePaginate);
export const ProviderModel = mongoose.model("Provider", provider);
