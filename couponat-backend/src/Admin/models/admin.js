import mongoose from "mongoose";

let adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fcmToken:String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let AdminModel = mongoose.model("Admin", adminSchema);

export { AdminModel };
