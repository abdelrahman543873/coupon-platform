import mongoose from "mongoose";
import { hashPass } from "../../utils/bcryptHelper";


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
    fcmToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let AdminModel = mongoose.model("Admin", adminSchema);

let admin = async () => {
  let admins = await AdminModel.findOne();
  if (!admins)
    await AdminModel({
      name: "Big Boss",
      email: "Boss@gmail.com",
      password:  await hashPass("1234567890"),
    })
      .save()
      .catch((err) => {});
};

admin();

export { AdminModel };
