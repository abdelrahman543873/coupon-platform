import express from "express";
import { getAdminTokenService } from "./testing.service.js";

const testingRouter = express.Router();

testingRouter.get("/getAdminToken", getAdminTokenService);

export { testingRouter };
