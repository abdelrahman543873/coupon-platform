import { Router } from "express";
import { providersRouter } from "../Users/routes/provider";
import { customersRouter } from "../Users/routes/client";
import { citiesRouter } from "../Cities/routes/cities";
import { categoryRouter } from "../Category/routes";
import { couponRouter } from "../Coupons/routes";
import { adminRouter } from "../Admin/routes/adminRouter";
import { AdminsController } from "../Admin/controllers/admin";
import { purchasingRouter } from "../Purchasing/routes";
import { notificationRouter } from "../CloudMessaging/routes";
import { adminValidationwar } from "../Admin/middlewares/validations/admin";

const router = Router();

router.use("/providers-management", providersRouter);
router.use("/customers-management", customersRouter);
router.use("/cities-management", citiesRouter);
router.use("/categories-management", categoryRouter);
router.use("/coupons-management", couponRouter);
router.use("/admin-management", adminRouter);
router.use("/cloud-messaging", notificationRouter);
router.use("/purchasing-management/", purchasingRouter);

router
  .route("/pass-reset")
  .post(adminValidationwar.resetPass, AdminsController.passReq);
router
  .route("/pass-reset/codeValidation")
  .post(AdminsController.checkResetCode);
router.route("/pass-reset/newPassword").post(AdminsController.changePassword);

export { router };
