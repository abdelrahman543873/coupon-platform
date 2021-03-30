import express from "express";
import { PaymentTypeController } from "../../controllers/paymentType.js";

const paymentRouter = express.Router();

paymentRouter.route("/").get(PaymentTypeController.getAll);

export { paymentRouter };
