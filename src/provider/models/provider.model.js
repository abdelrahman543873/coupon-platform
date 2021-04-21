import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserRoleEnum } from "../../user/user-role.enum.js";
import { type } from "../../city/city.enum.js";
const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: type[2],
      required: true,
    },
    coordinates: {
      type: [[Number]],
      required: true,
    },
  },
  { versionKey: false, _id: false }
);
export const provider = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    locations: {
      type: pointSchema,
    },
    metaData: [
      {
        formattedAddressAr: String,
        formattedAddressEn: String,
        level2longAr: String,
        level2longEn: String,
        googlePlaceId: String,
        _id: false,
      },
    ],
    slogan: {
      type: String,
    },
    image: { type: String },
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
    code: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
provider.plugin(mongoosePaginate);
export const ProviderModel = mongoose.model("Provider", provider);
