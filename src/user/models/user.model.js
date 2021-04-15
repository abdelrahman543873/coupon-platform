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
    phone: {
      type: String,
      unique: true,
      sparse: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
user.plugin(mongoosePaginate);
export const UserModel = mongoose.model("User", user);
