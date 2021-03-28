import { Router } from "express";
import { CategoryController } from "../../Category/controllers/index.js";
import { CategoryalidationWares } from "../../Category/middlewares/validation/index.js";
import { CityController } from "../../Cities/controllers/city.js";
import { cityValidationware } from "../../Cities/middlewares/validations/city.js";
import { CouponController } from "../../Coupons/controllers/index.js";
import { CouponValidationWares } from "../../Coupons/middlewares/validation/coupon.js";
import { BankAccountController } from "../../Purchasing/controllers/bank.js";
import { PaymentTypeController } from "../../Purchasing/controllers/paymentType.js";
import { subscriptionContoller } from "../../Purchasing/controllers/subscription.js";
import { BankValidationWares } from "../../Purchasing/middlewares/bank.js";
import { PaymentValidationWares } from "../../Purchasing/middlewares/paymentTypes.js";
import { ProviderControllers } from "../../Users/controllers/provider.js";
import { ProviderValidationWares } from "../../Users/middlewares/validations/provider.js";
import { uploadHelper } from "../../utils/MulterHelper.js";
import { AdminsController } from "../controllers/admin.js";
import { AdminAuth, ValidateAuth } from "../middlewares/admimAuth.js";
import { adminValidationwar } from "../middlewares/validations/admin.js";
const adminRouter = Router();
adminRouter.route("/").post(AdminAuth, adminValidationwar.add, AdminsController.add);
adminRouter.route("/auth").post(adminValidationwar.login, AdminsController.login);
adminRouter.route("/token-validate").get(ValidateAuth);
adminRouter.route("/cities").post(AdminAuth, cityValidationware.addCity, CityController.addCity).get(AdminAuth, CityController.getCities);
adminRouter.route("/cities/:id/modification").put(AdminAuth, cityValidationware.update, CityController.updateCity);
adminRouter.route("/cities/:id/toggle").put(AdminAuth, CityController.toggleCity);
adminRouter.route("/categories").post(AdminAuth, uploadHelper("Categories-Images/").fields([{
  name: "selectedImage"
}, {
  name: "unselectedImage"
}]), CategoryalidationWares.add, CategoryController.addCategory).get(AdminAuth, AdminsController.getAllCategories);
adminRouter.route("/categories/:id/modification").put(AdminAuth, uploadHelper("Categories-Images/").fields([{
  name: "selectedImage"
}, {
  name: "unselectedImage"
}]), CategoryalidationWares.update, AdminsController.updateCategory);
adminRouter.route("/categories/:id/deletion").delete(AdminAuth, AdminsController.deleteCategory);
adminRouter.route("/providers").post(AdminAuth, ProviderValidationWares.add, ProviderControllers.addProvider);
adminRouter.route("/providers/:id/logo").put(AdminAuth, uploadHelper("Providers-Images/").single("logoURL"), ProviderControllers.updateImage);
adminRouter.route("/provider/:id").get(AdminAuth, AdminsController.getProvider);
adminRouter.route("/providers/:id/coupons").post(AdminAuth, uploadHelper("Coupons-Images/").single("imgURL"), CouponValidationWares.addCoupon, AdminsController.addCoupon);
adminRouter.route("/providers/:id/modification").put(AdminAuth, ProviderValidationWares.updateProvider, AdminsController.updateProvider);
adminRouter.route("/providers").get(AdminAuth, AdminsController.getProviders);
adminRouter.route("/providers/:id/deletion").delete(AdminAuth, AdminsController.deleteProvider);
adminRouter.route("/statistics").get(AdminAuth, AdminsController.getStatistics);
adminRouter.route("/paymentType").post(AdminAuth, PaymentValidationWares.add, PaymentTypeController.add);
adminRouter.route("/paymentType").get(AdminAuth, PaymentTypeController.getAllForAdmin);
adminRouter.route("/paymentType/:id/toggle").post(AdminAuth, PaymentTypeController.switchPaymentWay);
adminRouter.route("/appBankAccount").post(AdminAuth, BankValidationWares.add, BankAccountController.add);
adminRouter.route("/appBankAccount").get(AdminAuth, BankAccountController.getAllForAdmin);
adminRouter.route("/appBankAccount/:id/toggle").post(AdminAuth, BankAccountController.toggleBankAccount);
adminRouter.route("/mails").get(AdminAuth, AdminsController.mails);
adminRouter.route("/mails/:id/reply").post(AdminAuth, adminValidationwar.mailReply, AdminsController.mailReply);
adminRouter.route("/mails/:id/deletion").delete(AdminAuth, AdminsController.deleteMail);
adminRouter.route("/subscriptions/unconfirmed").get(AdminAuth, subscriptionContoller.getUnconfirmed);
adminRouter.route("/subscriptions/:id/confirmation").post(AdminAuth, subscriptionContoller.confirmPayment);
adminRouter.route("/providers/:id/toggle").post(AdminAuth, AdminsController.toggleProviders);
adminRouter.route("/appCridit").get(AdminAuth, AdminsController.getCriditAcount).post(AdminAuth, adminValidationwar.editCriditCard, AdminsController.updateCriditAcount);
adminRouter.route("/changeName").post(AdminAuth, AdminsController.changeName);
adminRouter.route("/changePassword").post(AdminAuth, adminValidationwar.changePassword, AdminsController.AdminchangePassword);
adminRouter.route("/changeMailReq").post(AdminAuth, AdminsController.changeMailReq);
adminRouter.route("/changeMail").post(AdminAuth, adminValidationwar.changeEmail, AdminsController.changeMail);
adminRouter.route("/coupons").get(AdminAuth, CouponController.getAll); //adminRouter.route("/coupons/:id").get(AdminAuth, CouponController.getById);

adminRouter.route("/subscriptions").get(AdminAuth, AdminsController.getAllSubscriptions);
adminRouter.route("/cashSubscriptions").get(AdminAuth, AdminsController.getAllCashSubscriptions);
adminRouter.route("/coupons/search").get(AdminAuth, CouponController.search);
adminRouter.route("/providers/search").get(AdminAuth, ProviderControllers.search);
adminRouter.route("/providers/pdf-generation").post(AdminAuth, ProviderControllers.generatePDF);
adminRouter.route("/subscription/:id").get(AdminAuth, subscriptionContoller.getById); // adminRouter.route("/pro").post(ProviderControllers.updateIm);

export { adminRouter };