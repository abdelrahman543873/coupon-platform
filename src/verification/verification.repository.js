import { VerificationModel } from "./models/verification.model.js";

export const addVerificationCode = async (verification) => {
  return await VerificationModel.create(verification);
};
