import { Router } from "express";
import { providersRouter } from "../Users/routes/provider";
import { customersRouter } from "../Users/routes/client";
import { citiesRouter } from "../Cities/routes/cities";
import { categoryRouter } from "../Category/routes";
import { couponRouter } from "../Coupons/routes";
import { adminRouter } from "../Admin/routes/adminRouter";
import { AdminsController } from "../Admin/controllers/admin";

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
router.use("/admin-management", adminRouter);

router.route("/pass-reset").post(AdminsController.passReq);
router.route("/pass-reset/codeValidation").post(AdminsController.checkResetCode);
router.route("/pass-reset/newPassword").post(AdminsController.changePassword);

//router.use("/products", productsRouter);

//router.use("/purchasing-management", purchasingRouter);
//router.use("/notifications", notificationRouter);

export { router };
