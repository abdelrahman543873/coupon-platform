import express from "express";
// import { notificationsController } from "../controller/notification";

const notificationRouter = express.Router();

// notificationRouter
//   .route("/users/:id/addToken")
//   .post(notificationsController.addTokenToUser);

// notificationRouter
//   .route("/users/:id/logout")
//   .post(notificationsController.removeUserToken);

// notificationRouter
//   .route("/users/:id")
//   .get(notificationsController.getNotifications);

export { notificationFileName, notificationRouter };
