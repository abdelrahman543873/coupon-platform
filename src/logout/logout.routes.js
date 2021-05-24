import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication";
import { logoutService } from "./logout.service";

const logoutRouter = express.Router();

logoutRouter.route("/").post(authenticationMiddleware, logoutService);

export { logoutRouter };
