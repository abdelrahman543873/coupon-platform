import express from "express";
import { notificationsController } from "../controller/notification";

const notificationRouter = express.Router();
let notificationFileName = __filename;

/**
 * @swagger
 *
 * /api/v1/notifications/users/{id}/addToken:
 *  post:
 *     tags:
 *       - Notifications
 *     description: add fcm token
 *     summary: add fcm token
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              fcmToken:
 *                description: description in arabic
 *                type: string
 *              type:
 *                description: ADMIN / CLIENT / PROVIDER
 *                type: string
 *            required:
 *              -fcmToken
 *              -type
 *     parameters:
 *       - in: path
 *         description: user id
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

notificationRouter
  .route("/users/:id/addToken")
  .post(notificationsController.addTokenToUser);


  /**
 * @swagger
 *
 * /api/v1/notifications/users/{id}/logout:
 *  post:
 *     tags:
 *       - Notifications
 *     description: remove fcm token
 *     summary: remove fcm token
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              type:
 *                description: ADMIN / CLIENT / PROVIDER
 *                type: string
 *            required:
 *              -type
 *     parameters:
 *       - in: path
 *         description: user id
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

notificationRouter
  .route("/users/:id/logout")
  .post(notificationsController.removeUserToken);

/**
 * @swagger
 *
 * /api/v1/notifications/users/{id}:
 *  get:
 *     tags:
 *       - Notifications
 *     description: get Notifications
 *     summary: get Notifications
 *     parameters:
 *       - in: path
 *         description: user id
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

notificationRouter
  .route("/users/:id")
  .get(notificationsController.getNotifications);

export { notificationFileName, notificationRouter };
