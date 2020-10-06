import mongoose from "mongoose";

let providerSchema = mongoose.Schema(
  {
    username: {
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
    countryCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["MALE", "FEMALE", "NOT-SPECIFIED"],
      default: "NOT-SPECIFIED",
    },
    imgURL: String,
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
    },
    roles: [
      {
        type: String,
        enum: [
          "BAZAR_CREATOR",
          "BAZAR_PRODUCTS_EDITOR",
          "BAZAR_ORDER_HANDLER",
          "BAZAR_CUSTOMER_SERVICE",
        ],
        required: true,
      },
    ],
    isPhoneVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
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
    fcmToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let ProviderModel = mongoose.model("Provider", providerSchema);

export { ProviderModel };
