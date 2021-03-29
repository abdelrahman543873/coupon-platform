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
        _id: false,
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "City",
          autopopulate: true,
        },
        locations: [
          {
            lat: {
              type: String,
              required: true,
            },
            long: {
              type: String,
              required: true,
            },
            formattedAddressAr: String,
            formattedAddressEn: String,
            level2longAr: String,
            level2longEn: String,
            googlePlaceId: String,
          },
        ],
      },
    ],
    code: {
      type: String,
      // required: true,
      unique: true,
    },
    officeTele: {
      type: String,
      required: true,
    },

    websiteLink: String,
    facebookLink: String,
    instaLink: String,
    twittwerLink: String,
    fcmToken: String,
    qrURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// let ProviderModel = mongoose.model("Provider", providerSchema);

// export { ProviderModel };
