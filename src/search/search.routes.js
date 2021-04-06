import express from "express";
import { searchCouponsService } from "./search.service.js";

const searchRouter = express.Router();

searchRouter.route("/").get(searchCouponsService);

export { searchRouter };
