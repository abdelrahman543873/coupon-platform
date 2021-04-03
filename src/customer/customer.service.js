import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { addVerificationCode } from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import { CustomerRegisterRepository } from "./customer.repository.js";

export const CustomerRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ ...req.body, role: UserRoleEnum[1] });
    const customer = await CustomerRegisterRepository({
      _id: user._id,
      ...req.body,
      profilePictureURL: req.file,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      _id: user._id,
    });
    const code = await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    res.status(201).json({
      success: true,
      data: {
        user: { ...user.toJSON(), ...customer.toJSON() },
        code: verificationCode.code,
      },
    });
  } catch (error) {
    next(error);
  }
};
