import express from "express";
import { checkUserAuth } from "../../utils/auth";
import { notificationsController } from "../controller/notification";

const notificationRouter = express.Router();

notificationRouter
  .route("/addToken")
  .post(checkUserAuth, notificationsController.addTokenToUser);

notificationRouter
  .route("/logout")
  .post(checkUserAuth, notificationsController.removeUserToken);

notificationRouter
  .route("/notifications")
  .get(checkUserAuth, notificationsController.getNotifications);

export { notificationRouter };
