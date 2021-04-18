import express from "express";
import { getCitiesService } from "./city.service.js";

const cityRouter = express.Router();

cityRouter.route("/").get(getCitiesService);

export { cityRouter };
