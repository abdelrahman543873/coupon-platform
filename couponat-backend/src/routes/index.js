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

router.route("/terms&conditions").get((req, res, next) => {
  res.status(200).send({
    isSuccessed: true,
    data: {
      arabic:
        "عن طريق تنزيل التطبيق أو استخدامه ، ستنطبق هذه الشروط تلقائيًا عليك - لذلك يجب عليك التأكد من قراءتها بعناية قبل استخدام التطبيق. لا يُسمح لك بنسخ أو تعديل التطبيق أو أي جزء من التطبيق أو علاماتنا التجارية بأي شكل من الأشكال. لا يُسمح لك بمحاولة استخراج شفرة المصدر للتطبيق ، ولا يجب أيضًا محاولة ترجمة التطبيق إلى لغات أخرى ، أو إنشاء إصدارات مشتقة. لا يزال التطبيق نفسه وجميع العلامات التجارية وحقوق النشر وحقوق قواعد البيانات وحقوق الملكية الفكرية الأخرى المتعلقة به مملوكة لشركة ألف للبرمجيات.",
      english:
        "By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages, or make derivative versions. The app itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to Alef Software co.",
    },
    error: null,
  });
});

export { router };
