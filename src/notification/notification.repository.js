import { NotificationModel } from "./models/notification.model.js";
import { TokenModel } from "./models/fcm-token.model.js";

export const getNotificationsRepository = async (
  user,
  offset = 0,
  limit = 15
) => {
  return await NotificationModel.paginate(
    { user },
    {
      offset: offset * limit,
      limit,
    }
  );
};

export const addTokenRepository = async (fcmToken) => {
  return await TokenModel.create(fcmToken);
};

export const getUnregisteredTokens = async () => {
  return await TokenModel.distinct("fcmToken");
};

export const rawDeleteNotification = async () => {
  await NotificationModel.deleteMany({});
  return await TokenModel.deleteMany({});
};
