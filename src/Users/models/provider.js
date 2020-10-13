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
      select: false
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

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },

    cities:[
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],

    districts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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

let ProviderModel = mongoose.model("Provider", providerSchema);

export { ProviderModel };
