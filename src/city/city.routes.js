import express from "express";
import { getCitiesService } from "./city.service.js";
import { langMiddleware } from "../_common/helpers/lang.js";
const cityRouter = express.Router();

cityRouter.route("/").get(langMiddleware, getCitiesService);

export { cityRouter };
