import {
  getNotificationsRepository,
  addTokenRepository,
  getUnregisteredTokens,
} from "./notification.repository.js";
import {
  getAllAdminsTokens,
  getAllCustomersTokens,
} from "../user/user.repository.js";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import { getAllProvidersTokens } from "../provider/provider.repository.js";
import { NotifiedEnum } from "./notification.enum.js";
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

export const notifyUsers = async (message, notified) => {
  const notifiedUsers = [];
  if (notified === NotifiedEnum[0] || notified === NotifiedEnum[3])
    notifiedUsers.push(...(await getAllProvidersTokens()));
  if (
    notified === NotifiedEnum[1] ||
    notified === NotifiedEnum[3] ||
    notified === NotifiedEnum[4]
  )
    notifiedUsers.push(
      ...(await getAllCustomersTokens()),
      ...(await getUnregisteredTokens())
    );
  if (
    notified === NotifiedEnum[2] ||
    notified === NotifiedEnum[3] ||
    notified === NotifiedEnum[4]
  )
    notifiedUsers.push(...(await getAllAdminsTokens()));
  message.tokens = notifiedUsers;
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
    notifiedUsers.length > 0
      ? await admin.messaging().sendMulticast(message)
      : "null array";
  return response;
};
