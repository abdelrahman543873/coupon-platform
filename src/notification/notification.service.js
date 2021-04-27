import {
  getNotificationsRepository,
  addTokenRepository,
  getUnregisteredTokens,
} from "./notification.repository.js";
import { getAllUsersTokens } from "../user/user.repository.js";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

export const getNotificationsService = async (req, res, next) => {
  try {
    const notifications = await getNotificationsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.limit
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

export const allUsersNotification = async (message) => {
  const usersTokens = await getAllUsersTokens();
  const tokens = await getUnregisteredTokens();
  usersTokens.concat(tokens);
  message.tokens = usersTokens;
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
  const response =
    usersTokens.length > 0
      ? await admin.messaging().sendMulticast(message)
      : "null array";
  return response;
};
