import { VerificationModel } from "./models/verification.model.js";

export const addVerificationCode = async (verification) => {
  return await VerificationModel.create(verification);
};

export const verifyOTPRepository = async (user, code) => {
  return await VerificationModel.findOne({
    user,
    expirationDate: { $gte: Date.now() },
    code,
  });
};

export const resendCodeRepository = async (user) => {
  return await VerificationModel.findOne({
    user,
    expirationDate: { $gte: Date.now() },
  });
};

export const rawDeleteVerification = async () => {
  return await VerificationModel.deleteMany({});
};
