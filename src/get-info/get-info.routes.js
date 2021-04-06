import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { getInfoService } from "./get-info.service.js";

const getInfoRouter = express.Router();

getInfoRouter.route("/").get(authenticationMiddleware, getInfoService);

export { getInfoRouter };
