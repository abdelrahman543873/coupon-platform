import express from "express";
import { CouponController } from "../../Coupons/controllers/index.js";
import { subscriptionContoller } from "../../Purchasing/controllers/subscription.js";
import { checkUserAuth } from "../../utils/auth.js";
import { uploadHelper } from "../../utils/MulterHelper.js";
import { ClientControllers } from "../controllers/client.js";
import { ClientValidationWares } from "../middlewares/validations/client.js";
const customersRouter = express.Router();
customersRouter.route("/").post(uploadHelper("Customers-Images/").single("imgURL"), ClientValidationWares.addClient, ClientControllers.add).get(checkUserAuth, ClientControllers.getProfileInfo);
customersRouter.route("/auth").post(ClientValidationWares.login, ClientControllers.auth);
customersRouter.route("/social-auth").post(ClientValidationWares.socialLogin, ClientControllers.socialAuth);
customersRouter.route("/social-register").post(ClientValidationWares.socialRegister, ClientControllers.socialMediaRegister);
customersRouter.route("/:id/mobile/verification").post(ClientValidationWares.verifyMobile, ClientControllers.verifyMobile);
customersRouter.route("/:id/mobile/verification/resend").post(ClientControllers.resendMobileVerification);
customersRouter.route("/home").get(ClientControllers.home);
customersRouter.route("/scan/:code").get(checkUserAuth, subscriptionContoller.scan);
customersRouter.route("/subscriptions/:id/mark-use").post(checkUserAuth, subscriptionContoller.confirmUsage);
customersRouter.route("/coupons").get(CouponController.getAll);
customersRouter.route("/coupons/:id/subscription").get(checkUserAuth, subscriptionContoller.checkSubscription);
customersRouter.route("/search").get(CouponController.search);
customersRouter.route("/fav-coupons/sync").post(checkUserAuth, ClientControllers.asyncFavCoupons);
customersRouter.route("/fav-coupons/:id").put(checkUserAuth, ClientControllers.updateFavCoupons);
customersRouter.route("/fav-coupons").get(checkUserAuth, ClientControllers.getFavCoupons);
customersRouter.route("/newMobile").put(checkUserAuth, ClientValidationWares.changeMobile, ClientControllers.changeMobile);
customersRouter.route("/newPassword").put(checkUserAuth, ClientValidationWares.changePassword, ClientControllers.changePassword);
customersRouter.route("/contact-us").post(ClientValidationWares.contactUs, ClientControllers.contactUs);
customersRouter.route("/newPicture").post(checkUserAuth, uploadHelper("Customers-Images/").single("imgURL"), ClientControllers.changeProfile); // customersRouter
//   .route("/customers/info")
//   .get(checkCustomerAuth, ClientControllers.getProfile);
// customersRouter
//   .route("/customers/:id/orders/deliverd/verification")
//   .post(isIdAuthMathces, OrderContoller.confirmDeliverdOrder);
// customersRouter
//   .route("/customers/:id/coupons/counsumed")
//   .get(checkCustomerAuth, CouponPayController.getConsumedCoupons);
// customersRouter
//   .route("/customers/questions")
//   .get(ClientControllers.getFamiliarQuestions);
// customersRouter.use("/user-image", express.static("Users-Images"));

customersRouter.use("/customers/customers-images/", express.static("Customers-Images"));
export { customersRouter };