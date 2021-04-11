import { hashPass } from "../utils/bcryptHelper.js";
import { UserModel } from "./models/user.model.js";
import { UserRoleEnum } from "./user-role.enum.js";

export const createUser = async (user) => {
  return await UserModel.create({
    ...user,
    ...(user.email && { email: user.email.toLowerCase() }),
    ...(user.password && { password: await hashPass(user.password) }),
  });
};

export const updateUser = async (_id, user) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    {
      ...user,
      ...(user.newPassword && { password: await hashPass(user.newPassword) }),
    },
    { new: true }
  );
};

export const adminUpdateUser = async (_id, user) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    {
      ...user,
      ...(user.password && { password: await hashPass(user.password) }),
    },
    { new: true, omitUndefined: true }
  );
};

export const findUserByEmailOrPhone = async (user) => {
  return await UserModel.findOne({
    ...(user.email && !user.phone && { email: user.email.toLowerCase() }),
    ...(user.phone && !user.email && { phone: user.phone }),
    ...(user.phone &&
      user.email && {
        $or: [{ email: user.email.toLowerCase() }, { phone: user.phone }],
      }),
  });
};

export const searchProvidersRepository = async (
  name,
  offset = 0,
  limit = 15
) => {
  return await UserModel.paginate(
    {
      role: UserRoleEnum[0],
      name: { $regex: name, $options: "i" },
    },
    { limit, offset }
  );
};

export const adminDeleteUserRepository = async (_id) => {
  return await UserModel.findOneAndDelete({ _id }, { lean: true });
};

export const rawDeleteUser = async () => {
  return await UserModel.deleteMany({});
};
