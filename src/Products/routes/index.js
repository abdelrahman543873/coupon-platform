import { Router } from "express";
import { couponRouter } from "./coupon";
import { offersRouter } from "./offers";
import { productRouter } from "./product";

const productsRouter = Router();
productsRouter.use("/coupons", couponRouter);
productsRouter.use("/product", productRouter);
productsRouter.use("/offers", offersRouter);
export { productsRouter };
