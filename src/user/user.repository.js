import { ProviderModel } from "../provider/models/provider.model.js";
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
    { new: true, projection: { password: 0, user: 0 } }
  );
};

export const adminUpdateUser = async (_id, user) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    {
      ...user,
      ...(user.password && { password: await hashPass(user.password) }),
    },
    { new: true, omitUndefined: true, projection: { password: 0 } }
  );
};

export const findUserByEmailOrPhone = async (user) => {
  return await UserModel.findOne(
    {
      ...(user.email && !user.phone && { email: user.email.toLowerCase() }),
      ...(user.phone && !user.email && { phone: user.phone }),
      ...(user.phone &&
        user.email && {
          $or: [{ email: user.email.toLowerCase() }, { phone: user.phone }],
        }),
    },
    { password: 0 }
  );
};

export const findUserByEmailOrPhoneForLogin = async (user) => {
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
  return await ProviderModel.paginate(
    {
      role: UserRoleEnum[0],
      ...(name && { name: { $regex: name, $options: "i" } }),
    },
    { limit, offset, project: { password: 0 } }
  );
};

export const adminDeleteUserRepository = async (_id) => {
  return await UserModel.findOneAndDelete(
    { _id },
    { lean: true, projection: { password: 0 } }
  );
};

export const findUserById = async (_id) => {
  return await UserModel.findOne({ _id }, { password: 0 }, { lean: true });
};

export const getAllUsersTokens = async () => {
  return await UserModel.distinct("fcmToken");
};

export const rawDeleteUser = async () => {
  return await UserModel.deleteMany({});
};
