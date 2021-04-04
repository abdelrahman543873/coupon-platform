import mongoose from "mongoose";
import { UserRoleEnum } from "../user-role.enum.js";

export const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // password isn't required for the case of the social media register
    password: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      required: true,
    },
    // not unique cause users could be created without email and null email is considered duplicate on mongoose
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
