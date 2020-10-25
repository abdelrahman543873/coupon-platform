import express, { Router } from "express";
import { CategoryController } from "../../Category/controllers";
import { CategoryalidationWares } from "../../Category/middlewares/validation";
import { CityController } from "../../Cities/controllers/city";
import { cityValidationware } from "../../Cities/middlewares/validations/city";
import { CouponValidationWares } from "../../Coupons/middlewares/validation/coupon";
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
  );

adminRouter
  .route("/categories/:id/modification")
  .put(
    AdminAuth,
    uploadHelper("Categories-Images/").fields([
      { name: "selectedImage" },
      { name: "unselectedImage" },
    ]),
    CategoryalidationWares.update,
    CategoryController.updateCategory
  );

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
// citiesRouter
//   .route("/:id/districts/:districtId")
//   .delete(AdminCityControllers.deleteDistrict);

adminRouter
  .route("/cities/:id/districts")
  .post(
    AdminAuth,
    cityValidationware.addDistricts,
    CityController.addDistricts
  );

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

// adminRouter.use(
//   "/payments/adsPayments-images/",
//   express.static("AdsPayments-Images")
// );

export { adminRouter };
