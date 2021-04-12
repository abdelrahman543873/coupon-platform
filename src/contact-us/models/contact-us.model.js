import mongoose from "mongoose";
import { UserRoleEnum } from "../../user/user-role.enum.js";
import mongoosePaginate from "mongoose-paginate-v2";

const contactUs = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reply: {
      message: String,
      date: Date,
    },
    type: {
      type: String,
      required: true,
      enum: UserRoleEnum,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
contactUs.plugin(mongoosePaginate);
export const ContactUsModel = mongoose.model("ContactUs", contactUs);
