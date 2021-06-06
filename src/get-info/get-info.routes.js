import express from "express";
import { noActiveValidationMiddleware } from "../_common/helpers/no-active-validation-auth.js";
import { getInfoService } from "./get-info.service.js";

const getInfoRouter = express.Router();

getInfoRouter.route("/").get(noActiveValidationMiddleware, getInfoService);

export { getInfoRouter };
