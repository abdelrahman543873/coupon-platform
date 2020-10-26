import mongoose from "mongoose";

let clientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: String,
    countryCode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSocialMediaVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    socialMediaId: String,
    socialMediaType: {
      type: String,
      enum: ["GOOGLE", "FACEBOOK", "TWITTER"],
    },
    favCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon"}],
    fcmToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let ClientModel = mongoose.model("Client", clientSchema);

export { ClientModel };
