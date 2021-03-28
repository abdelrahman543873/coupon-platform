import express, { Router } from "express";
import { PaymentTypeController } from "../../controllers/paymentType.js";
const paymentRouter = Router();
paymentRouter.route("/").get(PaymentTypeController.getAll);
export { paymentRouter };