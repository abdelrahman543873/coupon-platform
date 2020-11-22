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
    },
    mobile: {
      type: String,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      sparse: true,
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
    socialMediaId: {
      type: String,
      unique: true,
      sparse: true,
    },
    socialMediaType: {
      type: String,
      enum: ["GOOGLE", "FACEBOOK", "TWITTER","APPLE"],
    },
    favCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    fcmToken: String,
    imgURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let ClientModel = mongoose.model("Client", clientSchema);

export { ClientModel };
