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
  CustomerRegisterService,
  getCustomerHomeService,
  getCustomersCouponsService,
  getCustomerService,
  getCustomerSubscriptionsService,
  resendCodeService,
  socialLoginService,
  socialRegisterService,
  verifyOTPService,
} from "./customer.service.js";
import { CustomerRegisterInput } from "./inputs/customer-register.input.js";
import { SocialLoginInput } from "./inputs/social-auth.input.js";
import { SocialRegisterInput } from "./inputs/social-register.input.js";
import { VerifyOTPInput } from "./inputs/verify-otp.input.js";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(
    uploadHelper("public/profile-pictures").single("profile-picture"),
    ValidationMiddleware(CustomerRegisterInput),
    fileValidationMiddleWare,
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
  .post(
    uploadHelper("public/profile-pictures").single("profile-picture"),
    ValidationMiddleware(SocialRegisterInput),
    fileValidationMiddleWare,
    socialRegisterService
  );

customersRouter.route("/home").get(getCustomerHomeService);

customersRouter.route("/getCoupons").get(getCustomersCouponsService);

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
    getCustomerSubscriptionsService
  );

export { customersRouter };
