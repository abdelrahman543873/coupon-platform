import express from "express";
import {
  searchCouponsService,
  searchProviderService,
} from "./search.service.js";

const searchRouter = express.Router();

searchRouter.route("/coupons").get(searchCouponsService);
searchRouter.route("/providers").get(searchProviderService);

export { searchRouter };
