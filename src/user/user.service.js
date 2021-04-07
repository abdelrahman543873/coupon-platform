import { providerRegisterRepository } from "../provider/provider.repository.js";
import { addVerificationCode } from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import { UserRoleEnum } from "./user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "./user.repository.js";

export const addProviderService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ role: UserRoleEnum[0], ...req.body });
    const provider = await providerRegisterRepository({
      user: user.id,
      ...req.body,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: user._id,
    });
    await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          ...provider.toJSON(),
          // this is done so the api user won't be confused between the User property of the provider and
          // the id of the provider
          _id: provider.user,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
