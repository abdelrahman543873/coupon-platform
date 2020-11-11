import { Router } from "express";
import { CategoryController } from "../../Category/controllers";
import { CategoryalidationWares } from "../../Category/middlewares/validation";
import { CityController } from "../../Cities/controllers/city";
import { cityValidationware } from "../../Cities/middlewares/validations/city";
import { CouponValidationWares } from "../../Coupons/middlewares/validation/coupon";
import { BankAccountController } from "../../Purchasing/controllers/bank";
import { PaymentTypeController } from "../../Purchasing/controllers/paymentType";
import { subscriptionContoller } from "../../Purchasing/controllers/subscription";
import { BankValidationWares } from "../../Purchasing/middlewares/bank";
import { PaymentValidationWares } from "../../Purchasing/middlewares/paymentTypes";
import { ProviderControllers } from "../../Users/controllers/provider";
import { ProviderValidationWares } from "../../Users/middlewares/validations/provider";
import { uploadHelper } from "../../utils/MulterHelper";
import { AdminsController } from "../controllers/admin";
import { AdminAuth } from "../middlewares/admimAuth";
import { adminValidationwar } from "../middlewares/validations/admin";

const adminRouter = Router();

adminRouter
  .route("/")
  .post(AdminAuth, adminValidationwar.add, AdminsController.add);

adminRouter
  .route("/auth")
  .post(adminValidationwar.login, AdminsController.login);

adminRouter
  .route("/cities")
  .post(AdminAuth, cityValidationware.addCity, CityController.addCity);

adminRouter
  .route("/categories")
  .post(
    AdminAuth,
    uploadHelper("Categories-Images/").fields([
      { name: "selectedImage" },
      { name: "unselectedImage" },
    ]),
    CategoryalidationWares.add,
    CategoryController.addCategory
  )
  .get(AdminAuth, AdminsController.getAllCategories);

adminRouter
  .route("/categories/:id/modification")
  .put(
    AdminAuth,
    uploadHelper("Categories-Images/").fields([
      { name: "selectedImage" },
      { name: "unselectedImage" },
    ]),
    CategoryalidationWares.update,
    AdminsController.updateCategory
  );

adminRouter
  .route("/categories/:id/deletion")
  .delete(AdminAuth, AdminsController.deleteCategory);

adminRouter
  .route("/providers")
  .post(
    AdminAuth,
    uploadHelper("Providers-Images/").single("logoURL"),
    ProviderValidationWares.add,
    ProviderControllers.addProvider
  );

adminRouter
  .route("/providers/:id/coupons")
  .post(
    AdminAuth,
    uploadHelper("Coupons-Images/").single("imgURL"),
    CouponValidationWares.addCoupon,
    AdminsController.addCoupon
  );

adminRouter
  .route("/providers/:id/modification")
  .put(
    AdminAuth,
    uploadHelper("Providers-Images/").single("logoURL"),
    ProviderValidationWares.updateProvider,
    AdminsController.updateProvider
  );

adminRouter.route("/providers").get(AdminAuth, AdminsController.getProviders);

adminRouter
  .route("/providers/:id/deletion")
  .delete(AdminAuth, AdminsController.deleteProvider);

adminRouter.route("/statistics").get(AdminAuth, AdminsController.getStatistics);

adminRouter
  .route("/paymentType")
  .post(AdminAuth, PaymentValidationWares.add, PaymentTypeController.add);

adminRouter
  .route("/paymentType")
  .get(AdminAuth, PaymentTypeController.getAllForAdmin);

adminRouter
  .route("/paymentType/:id/toggle")
  .post(AdminAuth, PaymentTypeController.switchPaymentWay);

adminRouter
  .route("/appBankAccount")
  .post(AdminAuth, BankValidationWares.add, BankAccountController.add);

adminRouter
  .route("/appBankAccount")
  .get(AdminAuth, BankAccountController.getAllForAdmin);

adminRouter
  .route("/appBankAccount/:id/toggle")
  .post(AdminAuth, BankAccountController.toggleBankAccount);

adminRouter.route("/mails").get(AdminAuth, AdminsController.mails);

adminRouter
  .route("/mails/:id/reply")
  .post(AdminAuth, adminValidationwar.mailReply, AdminsController.mailReply);

adminRouter
  .route("/subscriptions/unconfirmed")
  .get(AdminAuth, subscriptionContoller.getUnconfirmed);

adminRouter
  .route("/subscriptions/:id/confirmation")
  .post(AdminAuth, subscriptionContoller.confirmPayment);

adminRouter
  .route("/providers/:id/toggle")
  .post(AdminAuth, AdminsController.toggleProviders);

// adminRouter
//   .route("/questions/new")
//   .post(
//     AdminsAuth.isEditorOrHigher,
//     questionValidationwar.addQuestion,
//     AdminsController.addQustion
//   );

// adminRouter
//   .route("/questions")
//   .get(AdminsAuth.isEditorOrHigher, AdminsController.getFamiliarQuestions);

// adminRouter
//   .route("/adsPackages/new")
//   .post(
//     AdminsAuth.isEditorOrHigher,
//     packageValidationnwar.addPackage,
//     AdminsController.addPackage
//   );

// adminRouter
//   .route("/adsPackages")
//   .get(AdminsAuth.isEditorOrHigher, AdminsController.getPackages);

// adminRouter
//   .route("/adsPackages/:id/switch")
//   .post(AdminsAuth.isEditorOrHigher, AdminsController.setPackagesOff);

// adminRouter
//   .route("/app/cridit/modification")
//   .put(AdminsAuth.isEditorOrHigher, AdminsController.updateCriditAcount);

// adminRouter.use("/cities", AdminsAuth.isEditorOrHigher, citiesRouter);
// adminRouter.use("/bazars", AdminsAuth.isEditorOrHigher, bazarsRouter);

// adminRouter
//   .route("/app/banks")
//   .post(
//     AdminsAuth.isEditorOrHigher,
//     adminValidationwar.addBank,
//     AdminsController.addBanckAccount
//   );

// adminRouter
//   .route("/app/banks/:id/switch")
//   .post(AdminsAuth.isEditorOrHigher, AdminsController.toggleBankAccount);

// adminRouter
//   .route("/app/banks")
//   .get(AdminsAuth.isEditorOrHigher, AdminsController.getBanks);

export { adminRouter };
