import express from "express";
import { ProviderControllers } from "../controllers/provider";
import { ProviderValidationWares } from "../middlewares/validations/provider";
import { uploadHelper } from "../../utils/MulterHelper";
import { checkUserAuth } from "../../utils/auth";
import { subscriptionContoller } from "../../Purchasing/controllers/subscription";

const providersRouter = express.Router();

providersRouter
  .route("/")
  .post(
    uploadHelper("Providers-Images/").single("logoURL"),
    ProviderValidationWares.add,
    ProviderControllers.addProvider
  );

// providersRouter
//   .route("/emails/verification")
//   .post(
//     ProviderValidationWares.emailVerification,
//     ProviderControllers.emailVerification
//   );

providersRouter
  .route("/auth")
  .post(ProviderValidationWares.login, ProviderControllers.login);

// providersRouter
//   .route("/:id/verifications/mobile")
//   .post(
//     ProviderValidationWares.mobileVerification,
//     ProviderControllers.verifyMobile
//   );

// providersRouter
//   .route("/:id/verifications/mobile/new")
//   .post(isIdAuthMathces, ProviderControllers.resendMobileVerification);

providersRouter
  .route("/modification/")
  .put(
    checkUserAuth,
    uploadHelper("Providers-Images/").single("logoURL"),
    ProviderValidationWares.updateProvider,
    ProviderControllers.updateProvider
  );

providersRouter
  .route("/newPassword/")
  .put(
    checkUserAuth,
    ProviderValidationWares.changePassword,
    ProviderControllers.changePassword
  );

providersRouter
  .route("/subscriptions/scan/:code")
  .get(checkUserAuth, subscriptionContoller.scan);

providersRouter
  .route("/subscriptions/:id/confirmation")
  .post(checkUserAuth, subscriptionContoller.confirmUsage);

providersRouter
  .route("/coupons")
  .get(checkUserAuth, ProviderControllers.getAllCoupons);

providersRouter
  .route("/home")
  .get(checkUserAuth, ProviderControllers.getStatistics);

customersRouter
  .route("/contact-us")
  .post(
    checkUserAuth,
    ProviderValidationWares.contactUs,
    ProviderControllers.contactUs
  );

// providersRouter.use("/providers-images", express.static("Providers-Images"));

// providersRouter
//   .route("/:id")
//   .get(isIdAuthMathces, ProviderControllers.getProfileInfo);

// providersRouter
//   .route("/:id/ads")
//   .get(isIdAuthMathces, AdsController.getBazarAds);

// providersRouter
//   .route("/:id/orders")
//   .get(isIdAuthMathces, ProviderControllers.getOrderesList);

// providersRouter
//   .route("/:id/bazars/:bazar/coupons/consumed")
//   .get(isIdAuthMathces, BazarControllers.getConsumedCoupons);

// providersRouter
//   .route("/:id/bazars/coupons/consumed/:paymentId/confirmation")
//   .post(isIdAuthMathces, BazarControllers.confirmCouponPayment);

// providersRouter.route("/:id/app/cridit").get(AdminsController.getCriditAcount);

//rovidersRouter.route("/:id/app/banks").get(ProviderControllers.getAppBanks);
providersRouter.use(
  "/providers/providers-images",
  express.static("Providers-Images")
);
export { providersRouter };
