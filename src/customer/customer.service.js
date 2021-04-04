import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { generateToken } from "../utils/JWTHelper.js";
import { addVerificationCode } from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import {
  CustomerRegisterRepository,
  getCustomerBySocialLoginRepository,
  getCustomerRepository,
} from "./customer.repository.js";

export const CustomerRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ ...req.body, role: UserRoleEnum[1] });
    const customer = await CustomerRegisterRepository({
      user: user._id,
      ...req.body,
      profilePictureURL: req.file,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: user._id,
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

export const getCustomerService = async (req, res, next) => {
  try {
    const customer = await getCustomerRepository(req.currentUser._id);
    
    return res.status(200).json({
      success: true,
      data: { ...customer.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

export const socialLoginService = async (req, res, next) => {
  try {
    const customer = await getCustomerBySocialLoginRepository(
      req.body.socialMediaId
    );
    if (!customer) throw new BaseHttpError(611);
    if (!customer.isVerified) throw new BaseHttpError(612);
    res.status(200).json({
      success: true,
      data: { ...customer.toJSON(), auth: generateToken(customer.user.id) },
    });
  } catch (error) {
    next(error);
  }
};

export const socialRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({
      ...req.body,
      role: UserRoleEnum[1],
    });
    const customer = await CustomerRegisterRepository({
      user: user.id,
      ...req.body,
      profilePictureURL: req.file,
    });
    res.status(201).json({
      success: true,
      data: {
        ...user.toJSON(),
        ...customer.toJSON(),
        authToken: generateToken(user.id, "CLIENT"),
      },
    });
  } catch (error) {
    next(error);
  }
};
