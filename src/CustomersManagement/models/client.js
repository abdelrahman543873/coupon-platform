import mongoose from "mongoose";

let clientSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    countryCode:String,
    mobile: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSocialMediaVerified: {
      type: Boolean,
      default: false,
    },
    imgURL: String,
    socialMediaId: String,
    socialMediaType: {
      type: String,
      enum: ["GOOGLE", "FACEBOOK", "TWITTER"],
    },
    favProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    favCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "coupon" }],
    fcmToken:String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let ClientModel = mongoose.model("Client", clientSchema);

export { ClientModel };
