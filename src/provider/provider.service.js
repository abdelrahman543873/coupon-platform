import { NotificationModule } from "../CloudMessaging/module/notification.js";
import { generateToken } from "../utils/JWTHelper.js";
import { providerRegisterRepository } from "./provider.repository.js";

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
