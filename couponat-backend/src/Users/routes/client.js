import express from "express";
import { CategoryController } from "../../Category/controllers";
import { CouponController } from "../../Coupons/controllers";
import { checkUserAuth } from "../../utils/auth";
import { ClientControllers } from "../controllers/client";
import { ProviderControllers } from "../controllers/provider";
import { ClientValidationWares } from "../middlewares/validations/client";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(ClientValidationWares.addClient, ClientControllers.add);

customersRouter
  .route("/auth")
  .post(ClientValidationWares.login, ClientControllers.auth);

// customersRouter
//   .route("/customers/social-auth")
//   .post(Validations.socialAuth, ClientControllers.socialAuth);

customersRouter
  .route("/:id/mobile/verification")
  .post(ClientValidationWares.verifyMobile, ClientControllers.verifyMobile);

customersRouter
  .route("/:id/mobile/verification/resend")
  .post(ClientControllers.resendMobileVerification);

customersRouter.route("/home").get(ClientControllers.home);
// customersRouter.route("/providers").get(ProviderControllers.getAll);
// customersRouter.route("/categories").get(CategoryController.getAll);
customersRouter.route("/coupons").get(CouponController.getAll);

customersRouter.route("/search").get(CouponController.search);

// customersRouter
//   .route("/customers/fav-products/sync")
//   .post(checkCustomerAuth, ClientControllers.asyncFavProducts);

customersRouter
  .route("/fav-coupons/:id")
  .put(checkUserAuth, ClientControllers.updateFavCoupons);

customersRouter
  .route("/fav-coupons")
  .get(checkUserAuth, ClientControllers.getFavCoupons);

// customersRouter
//   .route("/customers/modification")
//   .put(
//     uploadHelper("Users-Images/").single("imgURL"),
//     Validations.updateProfile,
//     checkCustomerAuth,
//     ClientControllers.updateProfile
//   );

// customersRouter
//   .route("/customers/newPassword")
//   .put(
//     Validations.changePassword,
//     checkCustomerAuth,
//     ClientControllers.changePassword
//   );

// customersRouter
//   .route("/customers/info")
//   .get(checkCustomerAuth, ClientControllers.getProfile);

// customersRouter
//   .route("/payment")
//   .post(
//     checkCustomerAuth,
//     uploadHelper("Payments-Images/").single("imgURL"),
//     PaymentValidationWare.addPayment,
//     PaymentController.addPayment
//   );

// customersRouter
//   .route("/customers/:id/orders/deliverd/verification")
//   .post(isIdAuthMathces, OrderContoller.confirmDeliverdOrder);

// customersRouter
//   .route("/customers/:id/coupons/:couponId/consumption")
//   .post(
//     checkCustomerAuth,
//     uploadHelper("Payments-Images/").single("imgURL"),
//     CouponPayValidationWare.add,
//     CouponPayController.add
//   );

// customersRouter
//   .route("/customers/:id/coupons/counsumed")
//   .get(checkCustomerAuth, CouponPayController.getConsumedCoupons);

// customersRouter
//   .route("/customers/questions")
//   .get(ClientControllers.getFamiliarQuestions);

// customersRouter.use("/user-image", express.static("Users-Images"));

export { customersRouter };
