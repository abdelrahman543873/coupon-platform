import express, { Router } from "express";
import { CriditCardController } from "../controllers/criditCard.js";
import { bankAccountRouter } from "./route/bankAccount.js";
import { paymentRouter } from "./route/paymentType.js";
import { subscriptionRouter } from "./route/subscription.js";

const purchasingRouter = Router();

purchasingRouter.use("/paymentType", paymentRouter);
purchasingRouter.use("/appBankAccount", bankAccountRouter);
purchasingRouter.use("/subscription", subscriptionRouter);

purchasingRouter.use("/criditCard", CriditCardController.get);

purchasingRouter.use(
  "/subscriptions-images/",
  express.static("Subscriptions-Images")
);
export { purchasingRouter };
