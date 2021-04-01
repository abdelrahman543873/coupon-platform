import mongoose from "mongoose";
import { UserRoleEnum } from "../../user/user-role.enum";

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

export const ContactUsModel = mongoose.model("ContactUs", contactUs);
