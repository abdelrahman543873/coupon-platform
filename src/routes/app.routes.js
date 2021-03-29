import { Router } from "express";
import { customersRouter } from "../Users/routes/client.js";
import { citiesRouter } from "../Cities/routes/cities.js";
import { categoryRouter } from "../Category/routes/index.js";
import { couponRouter } from "../Coupons/routes/index.js";
import { adminRouter } from "../Admin/routes/adminRouter.js";
import { AdminsController } from "../Admin/controllers/admin.js";
import { purchasingRouter } from "../Purchasing/routes/index.js";
import { notificationRouter } from "../CloudMessaging/routes/index.js";
import { adminValidationwar } from "../Admin/middlewares/validations/admin.js";
import { termsAndConditionsRouter } from "../terms-and-conditions/terms-and-condtions.routes.js";
import { providersRouter } from "../provider/provider.routes.js";

const router = Router();

router.use("/providers-management", providersRouter);
router.use("/customers-management", customersRouter);
router.use("/cities-management", citiesRouter);
router.use("/categories-management", categoryRouter);
router.use("/coupons-management", couponRouter);
router.use("/admin-management", adminRouter);
router.use("/cloud-messaging", notificationRouter);
router.use("/purchasing-management/", purchasingRouter);
router.use("/admin-management", termsAndConditionsRouter);

router
  .route("/pass-reset")
  .post(adminValidationwar.resetPass, AdminsController.passReq);
router
  .route("/pass-reset/codeValidation")
  .post(AdminsController.checkResetCode);
router.route("/pass-reset/newPassword").post(AdminsController.changePassword);

export { router };
