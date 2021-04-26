import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { getNotificationsService } from "./notification.service.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { offSetLimitInput } from "../_common/helpers/limit-skip-validation.js";
const notificationRouter = express.Router();

notificationRouter
  .route("/getNotifications")
  .get(
    authenticationMiddleware,
    ValidationMiddleware(offSetLimitInput),
    getNotificationsService
  );

export { notificationRouter };
