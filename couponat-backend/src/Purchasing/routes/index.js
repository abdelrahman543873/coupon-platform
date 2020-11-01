import express, { Router } from "express";
import { CriditCardController } from "../controllers/criditCard";
import { bankAccountRouter } from "./bankAccount";
import { paymentRouter } from "./paymentType";

const purchasingRouter = Router();

purchasingRouter.use("/paymentType", paymentRouter);
purchasingRouter.use("/appBankAccount", bankAccountRouter);
purchasingRouter.use("/criditCard", CriditCardController.get);

purchasingRouter.use("/payments-images/", express.static("Payments-Images"));
export { purchasingRouter };
