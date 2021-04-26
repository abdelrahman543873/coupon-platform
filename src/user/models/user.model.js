import mongoose from "mongoose";
import { UserRoleEnum } from "../user-role.enum.js";
import mongoosePaginate from "mongoose-paginate-v2";

export const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    //solve this phones shouldn't be repeated
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    fcmToken: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
user.plugin(mongoosePaginate);
export const UserModel = mongoose.model("User", user);
