import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserRoleEnum } from "../../user/user-role.enum.js";
import { type } from "../../city/city.enum.js";
const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: type[1],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
provider.plugin(mongoosePaginate);
export const ProviderModel = mongoose.model("Provider", provider);
