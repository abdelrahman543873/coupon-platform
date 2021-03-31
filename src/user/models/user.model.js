import mongoose from "mongoose";
import { UserRoleEnum } from "../user-role.enum.js";

export const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let UserModel = mongoose.model("User", user);

export { UserModel };
