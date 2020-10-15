import { Router } from "express";
import { providersRouter } from "../Users/routes/provider";
import { customersRouter } from "../Users/routes/client";
import { citiesRouter } from "../Cities/routes/cities";
import { categoryRouter } from "../Category/routes";
import { couponRouter } from "../Coupons/routes";

const router = Router();
//router.use("/customers-management", customersRouter);

//router.use("/chat", chatRouter);

//router.use("/admins", adminRouter);
//router.use("/QRCode", qrRouter);

//router.use("/platform", platformSpecRouter);

router.use("/providers-management", providersRouter);
router.use("/customers-management", customersRouter);
router.use("/cities-management", citiesRouter);
router.use("/categories-management", categoryRouter);
router.use("/coupons-management", couponRouter);

//router.use("/products", productsRouter);

//router.use("/purchasing-management", purchasingRouter);
//router.use("/notifications", notificationRouter);

export { router };
