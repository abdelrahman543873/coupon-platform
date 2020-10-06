import { Router } from "express";
import { addressesRouter } from "./addresses";
import { orderRouter } from "./order";

const purchasingRouter = Router();

purchasingRouter.use("/addresses", addressesRouter);
purchasingRouter.use("/orders", orderRouter);

export { purchasingRouter };
