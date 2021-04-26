import faker from "faker";
import { userFactory } from "../user/user.factory.js";
import { NotificationModel } from "./models/notification.model.js";

export const buildNotificationParams = async (obj = {}) => {
  return {
    user: obj.user || (await userFactory())._id,
    arTitle: obj.arTitle || faker.name.title(),
    enTitle: obj.enTitle || faker.name.title(),
    enBody: obj.enBody || faker.commerce.productDescription(),
    arBody: obj.arBody || faker.commerce.productDescription(),
    data: obj.data || faker.commerce.productDescription(),
    action: obj.action || faker.name.title(),
  };
};

export const notificationsFactory = async (count = 10, obj = {}) => {
  const notifications = [];
  for (let i = 0; i < count; i++) {
    notifications.push(await buildNotificationParams(obj));
  }
  return await NotificationModel.collection.insertMany(notifications);
};

export const notificationFactory = async (obj = {}) => {
  const params = await buildNotificationParams(obj);
  return await NotificationModel.create(params);
};
