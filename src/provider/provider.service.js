import { NotificationModule } from "../CloudMessaging/module/notification.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  providerRegisterRepository,
  updateProviderRepository,
} from "./provider.repository.js";

export const providerRegisterService = async (req, res, next) => {
  try {
    const provider = await providerRegisterRepository(req.body);
    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider.id,
    });
    return res.status(201).json({
      success: true,
      data: {
        user: provider,
        authToken: generateToken(provider._id, "PROVIDER"),
      },
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderService = async (req, res, next) => {
  try {
    const passwordValidation = await bcryptCheckPass(
      req.body.password,
      req.currentUser.password
    );
    if (!passwordValidation) throw new BaseHttpError(607);
    const provider = await updateProviderRepository(
      req.currentUser._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: provider,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
