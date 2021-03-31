import { NotificationModule } from "../CloudMessaging/module/notification.js";
import { user } from "../user/models/user.model.js";
import { createUser, updateUser } from "../user/user.repository.js";
import { bcryptCheckPass } from "../utils/bcryptHelper.js";
import { generateToken } from "../utils/JWTHelper.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  providerRegisterRepository,
  updateProviderRepository,
} from "./provider.repository.js";

export const providerRegisterService = async (req, res, next) => {
  try {
    const { name, email, password, phone, ...providerData } = req.body;
    const user = await createUser({ name, email, password, phone });
    const provider = await providerRegisterRepository({
      userId: user.id,
      ...providerData,
    });
    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider.id,
    });

    return res.status(201).json({
      success: true,
      data: {
        user: { ...user.toJSON(), ...provider.toJSON() },
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
    const passwordValidation = req.body.password
      ? await bcryptCheckPass(req.body.password, req.currentUser.password)
      : true;
    if (!passwordValidation) throw new BaseHttpError(607);
    const user = await updateUser(req.currentUser._id, req.body);
    const provider = await updateProviderRepository(
      req.currentUser._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: { ...user.toJSON(), ...provider.toJSON() },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
