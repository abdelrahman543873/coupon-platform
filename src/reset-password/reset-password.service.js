import { findUserByEmailOrPhone, updateUser } from "../user/user.repository.js";
import { sendClientMail } from "../_common/helpers/nodemailer.js";
import {
  addVerificationCode,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { getCustomerRepository } from "../customer/customer.repository.js";
import { findProviderByEmail } from "../provider/provider.repository.js";
export const resetPasswordService = async (req, res, next) => {
  try {
    const user =
      (await findUserByEmailOrPhone({
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.email && { email: req.body.email }),
      })) || (await findProviderByEmail({ email: req.body.email }));
    if (!user) throw new BaseHttpError(611);
    if (req.body.code) {
      const verification = await verifyOTPRepository({
        code: req.body.code,
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.email && { email: req.body.email }),
      });
      if (!verification) throw new BaseHttpError(617);
      //returning extra user data
      let userData;
      user.isVerified = true;
      await user.save();
      user.role === UserRoleEnum[0] && (userData = user.toJSON());
      user.role === UserRoleEnum[1] &&
        (userData = await getCustomerRepository(user._id));
      res.status(200).json({
        success: true,
        data: {
          user: {
            ...userData,
            ...user.toJSON(),
          },
          authToken: generateToken(user._id, user.role),
        },
      });
    } else {
      const verificationCode = await addVerificationCode({
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
    }
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
