import { NotificationModel } from "./models/notification.model.js";
import { TokenModel } from "./models/fcm-token.model.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { NotifiedEnum } from "./notification.enum.js";

export const getNotificationsRepository = async (
  user,
  offset = 0,
  limit = 15
) => {
  return await NotificationModel.paginate(
    {
      ...(!user && {
        $or: [
          { user: NotifiedEnum[1] },
          { user: NotifiedEnum[3] },
          { user: NotifiedEnum[4] },
        ],
      }),
      ...(user === UserRoleEnum[0] && {
        $or: [{ user: NotifiedEnum[0] }, { user: NotifiedEnum[3] }],
      }),
      ...(user === UserRoleEnum[1] && {
        $or: [
          { user: NotifiedEnum[1] },
          { user: NotifiedEnum[3] },
          { user: NotifiedEnum[4] },
        ],
      }),
      ...(user === UserRoleEnum[2] && {
        $or: [
          { user: NotifiedEnum[2] },
          { user: NotifiedEnum[3] },
          { user: NotifiedEnum[4] },
        ],
      }),
    },
    {
      offset: offset * limit,
      limit,
      sort: { createdAt: -1 },
    }
  );
};

export const creteNotificationRepository = async (notification) => {
  return await NotificationModel.create(notification);
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
