import { Router } from "express";
import { providerManagementRouter } from "../Users/routes";
import {citiesRouter} from '../Cities/routes/cities'


const router = Router();
//router.use("/customers-management", customersRouter);

//router.use("/chat", chatRouter);

//router.use("/admins", adminRouter);
//router.use("/QRCode", qrRouter);

//router.use("/platform", platformSpecRouter);

router.use("/providers-management", providerManagementRouter);
router.use("/cities-management", citiesRouter);

//router.use("/products", productsRouter);

//router.use("/purchasing-management", purchasingRouter);
//router.use("/notifications", notificationRouter);

export { router };
