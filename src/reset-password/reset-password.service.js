import { findUserByEmailOrPhone, updateUser } from "../user/user.repository.js";
import { sendClientMail } from "../utils/nodemailer.js";
import {
  addVerificationCode,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import { generateToken } from "../utils/JWTHelper.js";

export const resetPasswordService = async (req, res, next) => {
  try {
    const user = await findUserByEmailOrPhone({
      ...(req.body.phone && { phone: req.body.phone }),
      ...(req.body.email && { email: req.body.email }),
    });
    if (!user) throw new BaseHttpError(611);
    if (req.body.code) {
      const verification = await verifyOTPRepository({
        code: req.body.code,
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.email && { email: req.body.email }),
      });
      if (!verification) throw new BaseHttpError(617);
      res.status(200).json({
        success: true,
        data: {
          authToken: generateToken(user._id, user.role),
        },
      });
    }
    const verificationCode = req.body.code
      ? null
      : await addVerificationCode({
          ...createVerificationCode(),
          ...(req.body.phone && { phone: req.body.phone }),
          ...(req.body.email && { email: req.body.email }),
        });
    req.body.phone &&
      (await sendMessage({
        to: req.body.phone,
        text: verificationCode.code,
      }));
    //change this message
    req.body.email &&
      (await sendClientMail("code", verificationCode.code, req.body.email));
    res.status(201).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordService = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.currentUser._id, {
      newPassword: req.body.newPassword,
    });
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};
