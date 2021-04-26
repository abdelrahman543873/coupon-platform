import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import {
  addeTokenService,
  getNotificationsService,
} from "./notification.service.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { offSetLimitInput } from "../_common/helpers/limit-skip-validation.js";
import { AddNotificationInput } from "../notification/inputs/add-notification.input.js";
import { semiAuthenticationMiddleware } from "../_common/helpers/semi-authentication.js";

const notificationRouter = express.Router();

notificationRouter
  .route("/getNotifications")
  .get(
    authenticationMiddleware,
    ValidationMiddleware(offSetLimitInput),
    getNotificationsService
  );

notificationRouter
  .route("/addToken")
  .post(
    semiAuthenticationMiddleware,
    ValidationMiddleware(AddNotificationInput),
    addeTokenService
  );

export { notificationRouter };
