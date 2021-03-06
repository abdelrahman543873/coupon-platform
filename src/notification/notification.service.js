import {
  getNotificationsRepository,
  addTokenRepository,
  getUnregisteredTokens,
  creteNotificationRepository,
} from "./notification.repository.js";
import {
  getAllAdminsTokens,
  getAllCustomersTokens,
  getUserToken,
} from "../user/user.repository.js";
import admin from "firebase-admin";
import dotenv from "dotenv";
import {
  getAllProvidersTokens,
  getProviderToken,
} from "../provider/provider.repository.js";
import { NotifiedEnum } from "./notification.enum.js";
dotenv.config();

export const getNotificationsService = async (req, res, next) => {
  try {
    const notifications = await getNotificationsRepository(
      req?.currentUser?.role,
      req.query.offset,
      req.query.limit,
      req?.currentUser?._id
    );
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const addeTokenService = async (req, res, next) => {
  try {
    if (req.currentUser) {
      req.currentUser.fcmToken = req.body.fcmToken;
      await req.currentUser.save();
      req.currentUser = req.currentUser.toJSON();
      delete req.currentUser.password;
    }
    const fcmToken = req.currentUser
      ? { user: req.currentUser }
      : await addTokenRepository(req.body);
    res.status(200).json({
      success: true,
      data: fcmToken,
    });
  } catch (error) {
    next(error);
  }
};

export const notifyUsers = async (message, _id = null) => {
  const notifiedUsers = [];
  if (message.user === NotifiedEnum[0] || message.user === NotifiedEnum[3])
    notifiedUsers.push(...(await getAllProvidersTokens()));
  if (
    message.user === NotifiedEnum[1] ||
    message.user === NotifiedEnum[3] ||
    message.user === NotifiedEnum[4]
  )
    notifiedUsers.push(
      ...(await getAllCustomersTokens()),
      ...(await getUnregisteredTokens())
    );
  if (
    message.user === NotifiedEnum[2] ||
    message.user === NotifiedEnum[3] ||
    message.user === NotifiedEnum[4] ||
    message.user === NotifiedEnum[5]
  )
    notifiedUsers.push(...(await getAllAdminsTokens()));
  if (message.user === NotifiedEnum[5] && _id) {
    notifiedUsers.push((await getProviderToken(_id)).fcmToken);
    message.id = _id;
  }
  if (message.user === NotifiedEnum[6] && _id) {
    notifiedUsers.push((await getUserToken(_id)).fcmToken);
    message.id = _id;
  }
  if (notifiedUsers.length === 0) return null;
  await creteNotificationRepository(message);
  message.tokens = Array.from(new Set(notifiedUsers));
  message.tokens = message.tokens.filter((value) => {
    return value !== "";
  });
  message.notification = {
    title: message.enTitle,
    body: message.enBody,
  };
  message.android = {
    notification: {
      click_action: "view_provider",
      sound: "default",
    },
  };
  message.apns = {
    payload: {
      aps: {
        category: "view_coupon",
        sound: "default",
        badge: 1,
      },
    },
  };
  message.webpush = {
    headers: {
      Urgency: "high",
    },
  };
  message.data = {
    id: JSON.stringify(message.data),
  };
  if (message.tokens.length) {
    const response = await admin.messaging().sendMulticast(message);
    return response;
  }
  return null;
};
