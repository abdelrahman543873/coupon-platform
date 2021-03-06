import express from "express";
import { termsAndConditionsRouter } from "../terms-and-conditions/terms-and-condtions.routes.js";
import { providersRouter } from "../provider/provider.routes.js";
import { contactUsRouter } from "../contact-us/contact-us.routes.js";
import { customersRouter } from "../customer/customer.routes.js";
import { adminRouter } from "../admin/admin.routes.js";
import { loginRouter } from "../login/login.routes.js";
import { getInfoRouter } from "../get-info/get-info.routes.js";
import { searchRouter } from "../search/search.routes.js";
import { testingRouter } from "../testing/testing.routes.js";
import { resetPassword } from "../reset-password/reset-password.routes.js";
import { cityRouter } from "../city/city.routes.js";
import { notificationRouter } from "../notification/notification.routes.js";
import { logoutRouter } from "../logout/logout.routes.js";
const router = express.Router();

router.use("/providers-management", providersRouter);
router.use("/customers-management", customersRouter);
router.use("/admin-management", adminRouter);
router.use("/notification", notificationRouter);
router.use("/admin-management", termsAndConditionsRouter);
router.use("/contact-us", contactUsRouter);
router.use("/login", loginRouter);
router.use("/getInfo", getInfoRouter);
router.use("/search", searchRouter);
router.use("/testing", testingRouter);
router.use("/reset-password", resetPassword);
router.use("/getCities", cityRouter);
router.use("/logout", logoutRouter);

export { router }
