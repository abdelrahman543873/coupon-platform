import express from "express";
import {
  addCategoryService,
  updateCategoryService,
} from "../category/category.service.js";
import {
  adminAddCouponService,
  adminGetProviderService,
  adminUpdateCouponService,
  adminUpdateProfileService,
  getAllCouponsService,
} from "../coupon/coupon.service.js";
import {
  addLocationService,
  getProvidersService,
  addLocationsService,
  deleteLocationService,
} from "../provider/provider.service.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { addProviderService } from "../user/user.service.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import {
  addAdminService,
  generateProviderQrCodeService,
  manageProviderStatusService,
  adminUpdateProviderService,
  adminDeleteProviderService,
  adminDeleteCouponService,
  adminDeleteCategoryService,
  getStatisticsService,
  generateProvidersPdf,
} from "./admin.service.js";
import { AddAdminInput } from "./inputs/add-admin.input.js";
import { AddCategoryInput } from "./inputs/add-category.input.js";
import { AddProviderInput } from "./inputs/add-provider.input.js";
import { AdminAddCouponInput } from "./inputs/admin-add-coupon.input.js";
import { AdminUpdateCouponInput } from "./inputs/admin-update-coupon.input.js";
import { ApproveProviderInput } from "./inputs/manage-provider-status.input.js";
import { UpdateCategoryInput } from "./inputs/update-category.input.js";
import { AdminUpdateProviderInput } from "./inputs/admin-update-provider.input.js";
import { DeleteProviderInput } from "./inputs/delete-provider.input.js";
import { AdminDeleteCouponInput } from "../provider/inputs/admin-delete-coupon.input.js";
import { AdminDeleteCategory } from "./inputs/admin-delete-category.js";
import { GetStatisticsInput } from "./inputs/get-statistics.input.js";
import { UpdateAdminInput } from "./inputs/update-admin.input.js";
import { DeleteContactUsInput } from "../contact-us/inputs/delete-contact-us.input.js";
import {
  adminSendContactsUsMessage,
  deleteContactUsMessageService,
  getContactUsMessageService,
  getContactUsMessagesService,
} from "../contact-us/contact-us.service.js";
import { AdminReplyInput } from "../contact-us/inputs/admin-reply.input.js";
import {
  addPaymentTypeService,
  getPaymentTypeService,
  getPaymentTypesService,
  updatePaymentTypeService,
} from "../payment/payment.service.js";
import { AddPaymentTypeInput } from "../../src/payment/inputs/add-payment-type.input.js";
import { TogglePaymentTypeInput } from "../../src/payment/inputs/toggle-payment-type.input.js";
import { ConfirmPaymentInput } from "../payment/inputs/confirm-payment.input.js";
import {
  addCityService,
  toggleCityService,
  updateCityService,
} from "../city/city.service.js";
import { AddCityInput } from "../city/inputs/add-city.input.js";
import { UpdateCityInput } from "../city/inputs/update-city.input.js";
import { toggleCityInput } from "../city/inputs/toggle-city.input.js";
import { AddBankAccountInput } from "../../src/bank/inputs/add-bank-account.input.js";
import {
  addBankAccountService,
  getBankAccountService,
  getBankAccountsService,
  toggleBankAccountService,
} from "../../src/bank/bank.service.js";
import { toggleBankAccountInput } from "../../src/bank/inputs/toggle-bank-account.input.js";
import { AddCreditInput } from "../credit/inputs/add-credit.input.js";
import { UpdateCreditInput } from "../credit/inputs/update-credit.input.js";
import {
  addCreditService,
  getCreditService,
  updateCreditService,
} from "../credit/credit.service.js";
import {
  confirmPaymentService,
  getAllSubscriptionsService,
  getSubscriptionService,
  getUnconfirmedPaymentsService,
} from "../subscription/subscription.service.js";
import { AdminAddLocationInput } from "../admin/inputs/admin-add-location.input.js";
import { AdminAddLocationsInput } from "../admin/inputs/admin-add-locations.input.js";
import { AdminGetSubscriptionsInput } from "../admin/inputs/admin-get-subscriptions.input.js";
import { offSetLimitInput } from "../_common/helpers/limit-skip-validation.js";
import { adminGetProviderInput } from "./inputs/admin-get-provider.input.js";
import { GetCouponsInput } from "../admin/inputs/admin-get-coupons.input.js";
import { GetSubscriptionInput } from "../provider/inputs/get-subscription.input.js";
import { AdminDeleteLocationInput } from "./inputs/admin-delete-location.input.js";
import { GetPaymentTypeInput } from "./inputs/get-payment.input.js";
import { GetBankInput } from "./inputs/get-bank.input.js";
import { GetContactUsMessagesInput } from "./inputs/get-contact-us-messages.input.js";

const adminRouter = express.Router();

adminRouter
  .route("/addAdmin")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[3]),
    ValidationMiddleware(AddAdminInput),
    addAdminService
  );

adminRouter.route("/addCategory").post(
  authenticationMiddleware,
  authorizationMiddleware(UserRoleEnum[2]),
  uploadHelper("public/category-pictures").fields([
    { name: "selected", maxCount: 1 },
    { name: "unSelected", maxCount: 1 },
  ]),
  fileValidationMiddleWare,
  ValidationMiddleware(AddCategoryInput),
  addCategoryService
);

adminRouter.route("/updateCategory").put(
  authenticationMiddleware,
  authorizationMiddleware(UserRoleEnum[2]),
  uploadHelper("public/category-pictures").fields([
    { name: "selected", maxCount: 1 },
    { name: "unSelected", maxCount: 1 },
  ]),
  fileValidationMiddleWare,
  ValidationMiddleware(UpdateCategoryInput),
  updateCategoryService
);

adminRouter
  .route("/toggleProvider")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(ApproveProviderInput),
    manageProviderStatusService
  );

adminRouter
  .route("/generateProviderQrCode")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(ApproveProviderInput),
    generateProviderQrCodeService
  );

adminRouter
  .route("/getStatistics")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(GetStatisticsInput),
    getStatisticsService
  );

adminRouter
  .route("/addProvider")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/logos").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(AddProviderInput),
    addProviderService
  );

adminRouter.route("/getProviders").get(getProvidersService);

adminRouter
  .route("/addCoupon")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/coupons").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(AdminAddCouponInput),
    adminAddCouponService
  );

adminRouter
  .route("/updateCoupon")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/coupons").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(AdminUpdateCouponInput),
    adminUpdateCouponService
  );

adminRouter
  .route("/updateProvider")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/logos").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(AdminUpdateProviderInput),
    adminUpdateProviderService
  );

adminRouter
  .route("/deleteProvider")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(DeleteProviderInput),
    adminDeleteProviderService
  );

adminRouter
  .route("/deleteCoupon")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminDeleteCouponInput),
    adminDeleteCouponService
  );

adminRouter
  .route("/deleteCategory")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminDeleteCategory),
    adminDeleteCategoryService
  );

adminRouter
  .route("/getCoupons")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(GetCouponsInput),
    getAllCouponsService
  );

adminRouter
  .route("/getSubscriptions")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminGetSubscriptionsInput),
    getAllSubscriptionsService
  );

adminRouter
  .route("/getProvider")
  .get(ValidationMiddleware(adminGetProviderInput), adminGetProviderService);

adminRouter
  .route("/updateProfile")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(UpdateAdminInput),
    adminUpdateProfileService
  );

adminRouter
  .route("/deleteContactUsMessage")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(DeleteContactUsInput),
    deleteContactUsMessageService
  );

adminRouter
  .route("/getContactUsMessages")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(GetContactUsMessagesInput),
    getContactUsMessagesService
  );

adminRouter
  .route("/mailReply")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminReplyInput),
    adminSendContactsUsMessage
  );

adminRouter
  .route("/getSubscription")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(GetSubscriptionInput),
    getSubscriptionService
  );

adminRouter
  .route("/addPaymentType")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddPaymentTypeInput),
    addPaymentTypeService
  );

adminRouter
  .route("/getPaymentTypes")
  .get(authenticationMiddleware, getPaymentTypesService);

adminRouter
  .route("/getPaymentType")
  .get(
    authenticationMiddleware,
    ValidationMiddleware(GetPaymentTypeInput),
    getPaymentTypeService
  );

adminRouter
  .route("/togglePaymentType")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(TogglePaymentTypeInput),
    updatePaymentTypeService
  );

adminRouter
  .route("/confirmPayment")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(ConfirmPaymentInput),
    confirmPaymentService
  );

adminRouter
  .route("/getUnconfirmedPayments")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    getUnconfirmedPaymentsService
  );

adminRouter
  .route("/addCity")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddCityInput),
    addCityService
  );

adminRouter
  .route("/updateCity")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(UpdateCityInput),
    updateCityService
  );

adminRouter
  .route("/toggleCity")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(toggleCityInput),
    toggleCityService
  );

adminRouter
  .route("/addBankAccount")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddBankAccountInput),
    addBankAccountService
  );

adminRouter
  .route("/toggleBankAccount")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(toggleBankAccountInput),
    toggleBankAccountService
  );

adminRouter
  .route("/getBankAccounts")
  .get(
    authenticationMiddleware,
    ValidationMiddleware(offSetLimitInput),
    getBankAccountsService
  );

adminRouter
  .route("/getBankAccount")
  .get(
    authenticationMiddleware,
    ValidationMiddleware(GetBankInput),
    getBankAccountService
  );

adminRouter
  .route("/updateCredit")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(UpdateCreditInput),
    updateCreditService
  );

adminRouter
  .route("/addCredit")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddCreditInput),
    addCreditService
  );

adminRouter.route("/getCredit").get(authenticationMiddleware, getCreditService);

adminRouter
  .route("/addLocation")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminAddLocationInput),
    addLocationService
  );

adminRouter
  .route("/addLocations")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminAddLocationsInput),
    addLocationsService
  );

adminRouter
  .route("/getProvidersPdf")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    generateProvidersPdf
  );

adminRouter
  .route("/deleteLocation")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AdminDeleteLocationInput),
    deleteLocationService
  );

adminRouter
  .route("/getContactUsMessage")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(DeleteContactUsInput),
    getContactUsMessageService
  );

export { adminRouter };
