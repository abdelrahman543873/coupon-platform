import express from "express";
import { citiesRouter } from "../Cities/routes/cities.js";
import { categoryRouter } from "../Category/routes/index.js";
import { couponRouter } from "../Coupons/routes/index.js";
import { AdminsController } from "../Admin/controllers/admin.js";
import { purchasingRouter } from "../Purchasing/routes/index.js";
import { notificationRouter } from "../CloudMessaging/routes/index.js";
import { adminValidationwar } from "../Admin/middlewares/validations/admin.js";
import { termsAndConditionsRouter } from "../terms-and-conditions/terms-and-condtions.routes.js";
import { providersRouter } from "../provider/provider.routes.js";
import { contactUsRouter } from "../contact-us/contact-us.routes.js";
import { customersRouter } from "../customer/customer.routes.js";
import { adminRouter } from "../admin/admin.routes.js";
import { loginRouter } from "../login/login.routes.js";

const router = express.Router();

router.use("/providers-management", providersRouter);
router.use("/customers-management", customersRouter);
router.use("/cities-management", citiesRouter);
router.use("/categories-management", categoryRouter);
router.use("/coupons-management", couponRouter);
router.use("/admin-management", adminRouter);
router.use("/cloud-messaging", notificationRouter);
router.use("/purchasing-management/", purchasingRouter);
router.use("/admin-management", termsAndConditionsRouter);
router.use("/contact-us", contactUsRouter);
router.use("/login", loginRouter);

router
  .route("/pass-reset")
  .post(adminValidationwar.resetPass, AdminsController.passReq);
router
  .route("/pass-reset/codeValidation")
  .post(AdminsController.checkResetCode);
router.route("/pass-reset/newPassword").post(AdminsController.changePassword);

export { router };
