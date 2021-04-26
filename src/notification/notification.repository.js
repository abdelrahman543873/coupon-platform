import { NotificationModel } from "./models/notification.model.js";
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

export const rawDeleteNotification = async () => {
  return await NotificationModel.deleteMany({});
};
