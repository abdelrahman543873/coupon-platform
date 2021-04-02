import { hashPass } from "../utils/bcryptHelper.js";
import { UserModel } from "./models/user.model.js";

export const createUser = async (user) => {
  return await UserModel.create({
    ...user,
    ...(user.password && { password: await hashPass(user.password) }),
  });
};

export const updateUser = async (_id, user) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    {
      ...user,
      ...(user.password && { password: await hashPass(user.newPassword) }),
    },
    { new: true }
  );
};

export const findUserByEmailOrPhone = async (user) => {
  return await UserModel.findOne({
    $or: [{ email: user.email }, { phone: user.phone }],
  });
};

export const rawDeleteUser = async () => {
  return await UserModel.deleteMany({});
};
