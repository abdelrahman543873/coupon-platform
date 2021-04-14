import {
  findProviderByEmailForLogin,
  providerRegisterRepository,
} from "../provider/provider.repository.js";
import { addVerificationCode } from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import { UserRoleEnum } from "./user-role.enum.js";
import { findUserByEmailOrPhoneForLogin } from "./user.repository.js";

export const addProviderService = async (req, res, next) => {
  try {
    const existingProvider = await findProviderByEmailForLogin({
      provider: req.body,
    });
    const user = await findUserByEmailOrPhoneForLogin(req.body);
    if (existingProvider || user) throw new BaseHttpError(601);
    const provider = await providerRegisterRepository({
      ...req.body,
      image: req.file,
      role: UserRoleEnum[0],
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: provider._id,
    });
    await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};
