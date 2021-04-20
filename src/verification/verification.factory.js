import faker from "faker";
import { userFactory } from "../user/user.factory";
import dotenv from "dotenv";
import { VerificationModel } from "./models/verification.model";

dotenv.config();
export const buildVerificationParams = async (obj = {}) => {
  return {
    user: obj.user || (await userFactory()).id,
    code: obj.code || faker.datatype.number(),
    expirationDate:
      obj.expirationDate ||
      Date.now() + Number(process.env.OTP_EXPIRY_TIME) * 1000 * 60,
    phone: obj.phone || faker.phone.phoneNumber("+20165#######"),
    email: obj.email || faker.internet.email(),
  };
};

export const verificationsFactory = async (count = 10, obj = {}) => {
  const verifications = [];
  for (let i = 0; i < count; i++) {
    verifications.push(await buildVerificationParams(obj));
  }
  return await VerificationModel.collection.insertMany(verifications);
};

export const verificationFactory = async (obj = {}) => {
  const params = await buildVerificationParams(obj);
  return await VerificationModel.create(params);
};
