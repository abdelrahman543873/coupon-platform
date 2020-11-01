import express, { Router } from "express";
import { paymentRouter } from "./paymentType";

const purchasingRouter = Router();

purchasingRouter.use("/paymentType", paymentRouter);

purchasingRouter.use(
  "/payments-images/",
  express.static("Payments-Images")
);
export { purchasingRouter };
