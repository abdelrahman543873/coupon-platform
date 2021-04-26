import express from "express";
import { semiAuthenticationMiddleware } from "../_common/helpers/semi-authentication.js";
import {
  searchCouponsService,
  searchProviderService,
} from "./search.service.js";

const searchRouter = express.Router();

searchRouter
  .route("/coupons")
  .get(semiAuthenticationMiddleware, searchCouponsService);

searchRouter.route("/providers").get(searchProviderService);

export { searchRouter };
