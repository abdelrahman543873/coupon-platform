import mongoose from "mongoose";
import { UserRoleEnum } from "../../user/user-role.enum.js";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
      email: String,
      message: String,
      date: Date,
      name: String,
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
contactUs.plugin(aggregatePaginate);
export const ContactUsModel = mongoose.model("ContactUs", contactUs);
