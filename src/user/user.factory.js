import faker from "faker";
import { hashPass } from "../_common/helpers/bcryptHelper.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import { UserModel } from "./models/user.model.js";
import { UserRoleEnum } from "./user-role.enum.js";

export const buildUserParams = async (obj = {}) => {
  return {
    name: obj.name || faker.name.firstName(),
    email: obj.email || faker.internet.email().toLowerCase(),
    password: obj.password || faker.internet.password(),
    phone: obj.phone || faker.phone.phoneNumber("+20165#######"),
    role: obj.role || faker.random.arrayElement(UserRoleEnum),
    fcmToken: obj.fcmToken ?? "",
  };
};

export const UsersFactory = async (count = 10, obj = {}) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await buildUserParams(obj));
  }
  return await UserModel.collection.insertMany(users);
};

export const userFactory = async (obj = {}) => {
  const params = await buildUserParams(obj);
  params.password = await hashPass(params.password);
  const user = await UserModel.create(params);
  user.token = generateToken(user._id, "PROVIDER");
  return user;
};
