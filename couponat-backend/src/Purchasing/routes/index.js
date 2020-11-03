import express, { Router } from "express";
import { CriditCardController } from "../controllers/criditCard";
import { bankAccountRouter } from "./route/bankAccount";
import { paymentRouter } from "./route/paymentType";
import { subscriptionRouter } from "./route/subscription";

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
