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
    uploadHelper("public/profile-pictures").single("profile-picture"),
    ValidationMiddleware(CustomerRegisterInput),
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
    uploadHelper("public/profile-pictures").single("profile-picture"),
    ValidationMiddleware(SocialRegisterInput),
    fileValidationMiddleWare,
    socialRegisterService
  );

customersRouter
  .route("/home")
  .get(
    // authenticationMiddleware,
    // authorizationMiddleware(UserRoleEnum[1]),
    getCustomerHomeService
  );

export { customersRouter };
