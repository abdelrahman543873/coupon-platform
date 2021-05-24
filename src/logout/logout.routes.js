import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { logoutService } from "./logout.service.js";

const logoutRouter = express.Router();

logoutRouter.route("/").post(authenticationMiddleware, logoutService);

export { logoutRouter };
