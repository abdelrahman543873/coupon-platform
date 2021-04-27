import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import {
  changePhoneService,
  CustomerRegisterService,
  getCouponService,
  getCustomerHomeService,
  getCustomersCouponsService,
  getCustomerService,
  getCustomerSubscriptionService,
  getFavCouponsService,
  resendCodeService,
  socialLoginService,
  socialRegisterService,
  syncCouponsService,
  toggleFavCouponService,
  updateCustomerService,
  verifyOTPService,
} from "./customer.service.js";
import { CustomerRegisterInput } from "./inputs/customer-register.input.js";
import { SocialLoginInput } from "./inputs/social-auth.input.js";
import { SocialRegisterInput } from "./inputs/social-register.input.js";
import { VerifyOTPInput } from "./inputs/verify-otp.input.js";
import { AddFavCouponInput } from "./inputs/add-fav-coupon.input.js";
import { AddFavCouponsInput } from "./inputs/add-fav-coupons.input.js";
import { MarkCouponUsedInput } from "./inputs/mark-coupon-used.input.js";
import { UpdateCustomerInput } from "./inputs/update-customer.input.js";
import { SubscribeInput } from "./inputs/subscribe.input.js";
import { semiAuthenticationMiddleware } from "../_common/helpers/semi-authentication.js";
import { ScanInput } from "../customer/inputs/scan.input.js";
import {
  getCustomerHomeSubscriptionsService,
  getCustomerSubscriptionsService,
  markCouponUsedService,
  subscribeService,
} from "../subscription/subscription.service.js";
import { offSetLimitInput } from "../_common/helpers/limit-skip-validation.js";
import { GetCustomersCouponsInput } from "./inputs/get-coupons.input.js";
import { GetCustomersCouponInput } from "./inputs/get-coupon.input.js";
import { ChangePhoneInput } from "./inputs/change-phone.input.js";
import { GetProviderLocationsInput } from "../customer/inputs/get-provider-locations.input.js";
import { getProviderLocationsService } from "../provider/provider.service.js";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(
    uploadHelper("public/profile-pictures").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(CustomerRegisterInput),
    CustomerRegisterService
  );

customersRouter
  .route("/")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    getCustomerService
  );

customersRouter
  .route("/social-auth")
  .post(ValidationMiddleware(SocialLoginInput), socialLoginService);

customersRouter
  .route("/social-register")
  .post(ValidationMiddleware(SocialRegisterInput), socialRegisterService);

customersRouter
  .route("/home")
  .get(ValidationMiddleware(offSetLimitInput), getCustomerHomeService);

customersRouter
  .route("/getCoupons")
  .get(
    semiAuthenticationMiddleware,
    ValidationMiddleware(GetCustomersCouponsInput),
    getCustomersCouponsService
  );

customersRouter
  .route("/verifyOTP")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(VerifyOTPInput),
    verifyOTPService
  );

customersRouter
  .route("/resendCode")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    resendCodeService
  );

customersRouter
  .route("/getSubscriptions")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    getCustomerHomeSubscriptionsService
  );

customersRouter
  .route("/getSubscription")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    getCustomerSubscriptionService
  );

customersRouter
  .route("/toggleFavCoupon")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(AddFavCouponInput),
    toggleFavCouponService
  );

customersRouter
  .route("/updateProfile")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    uploadHelper("public/logos").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(UpdateCustomerInput),
    updateCustomerService
  );

customersRouter
  .route("/getFavCoupons")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    getFavCouponsService
  );

customersRouter
  .route("/syncFavCoupons")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(AddFavCouponsInput),
    syncCouponsService
  );

customersRouter
  .route("/getCoupon")
  .get(ValidationMiddleware(GetCustomersCouponInput), getCouponService);

customersRouter
  .route("/markCouponUsed")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(MarkCouponUsedInput),
    markCouponUsedService
  );

customersRouter
  .route("/subscribe")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    uploadHelper("public/payments").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(SubscribeInput),
    subscribeService
  );
customersRouter
  .route("/scan")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(ScanInput),
    getCustomerSubscriptionsService
  );

customersRouter
  .route("/changePhone")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(ChangePhoneInput),
    changePhoneService
  );

customersRouter
  .route("/getProviderLocations")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[1]),
    ValidationMiddleware(GetProviderLocationsInput),
    getProviderLocationsService
  );

export { customersRouter };
