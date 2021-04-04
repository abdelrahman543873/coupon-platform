import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import {
  CustomerRegisterService,
  getCustomerService,
  socialLoginService,
  socialRegisterService,
} from "./customer.service.js";
import { CustomerRegisterInput } from "./inputs/customer-register.input.js";
import { SocialLoginInput } from "./inputs/social-auth.input.js";
import { SocialRegisterInput } from "./inputs/social-register.input.js";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(
    ValidationMiddleware(CustomerRegisterInput),
    uploadHelper("public/profile-pictures").single("profile-picture"),
    fileValidationMiddleWare,
    CustomerRegisterService
  );

customersRouter.route("/").get(authenticationMiddleware, getCustomerService);

customersRouter
  .route("/social-auth")
  .post(ValidationMiddleware(SocialLoginInput), socialLoginService);

customersRouter
  .route("/social-register")
  .post(
    ValidationMiddleware(SocialRegisterInput),
    uploadHelper("public/profile-pictures").single("profile-picture"),
    fileValidationMiddleWare,
    socialRegisterService
  );

export { customersRouter };
