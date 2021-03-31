import faker from "faker";
import { hashPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import { UserModel } from "./models/user.model.js";
import { UserRoleEnum } from "./user-role.enum.js";

export const buildUserParams = async (obj = {}) => {
  return {
    name: obj.name || faker.name.firstName(),
    email: obj.email || faker.internet.email(),
    password: obj.password
      ? await hashPass(obj.password)
      : await hashPass(faker.internet.password()),
    phone: obj.phone || faker.phone.phoneNumber(),
    role: obj.role || faker.random.arrayElement[UserRoleEnum],
  };
};

export const UsersFactory = async (count = 10, obj = {}) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await buildTermsAndConditionsParams(obj));
  }
  return await UserModel.collection.insertMany(users);
};

export const userFactory = async (obj = {}) => {
  const params = await buildUserParams(obj);
  const user = await UserModel.create(params);
  user.token = generateToken(user._id, "PROVIDER");
  return user;
};
