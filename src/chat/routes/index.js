const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const { chatController } = require("../controllers/chat");
const chatFileName = __filename;
import express from "express";
import { checkUserAuth } from "../middlewares/auth";

const options = {
  definition: {
    openapi: "3.0.0", // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: "Customers Management", // Title (required)
      version: "1.0.0", // Version (required)
      description: "All Customers Management endpoints.",
    },
  },
  apis: [__filename],
};
const swaggerSpec = swaggerJSDoc(options);

const chatRouter = express.Router();

/**
 * @swagger
 *
 * /api/v1/chat/channels:
 *  get:
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         description: user id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: okay
 */
chatRouter.route("/channels").get(checkUserAuth,chatController.getChannels);

export { chatRouter, chatFileName };
