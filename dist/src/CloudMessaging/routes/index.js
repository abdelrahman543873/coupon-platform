import express from "express";
import { checkUserAuth } from "../../utils/auth.js";
import { notificationsController } from "../controller/notification.js";
const notificationRouter = express.Router();
notificationRouter.route("/addToken").post(notificationsController.addTokenToUser);
notificationRouter.route("/logout").post(checkUserAuth, notificationsController.removeUserToken);
notificationRouter.route("/notifications").get(notificationsController.getNotifications);
export { notificationRouter };