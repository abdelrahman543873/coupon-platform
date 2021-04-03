import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ProviderLoginInput } from "./inputs/provider-login.input.js";
import { ProviderRegisterInput } from "./inputs/provider-register.input.js";
import { UpdateProviderInput } from "./inputs/update-provider.input.js";
import { AddCouponInput } from "./inputs/add-coupon.input.js";
import {
  addCouponService,
  getMyCouponsService,
  getProviderHomeService,
  getProviderService,
  providerLoginService,
  providerRegisterService,
  updateProviderService,
} from "./provider.service.js";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
const providersRouter = express.Router();

providersRouter
  .route("/")
  .post(ValidationMiddleware(ProviderRegisterInput), providerRegisterService);

providersRouter
  .route("/")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    getProviderService
  );

providersRouter
  .route("/modification")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(UpdateProviderInput),
    uploadHelper("public/logos").single("logo"),
    fileValidationMiddleWare,
    updateProviderService
  );

providersRouter
  .route("/auth")
  .post(ValidationMiddleware(ProviderLoginInput), providerLoginService);

providersRouter
  .route("/coupons")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    getMyCouponsService
  );

providersRouter
  .route("/home")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    getProviderHomeService
  );

providersRouter
  .route("/add-coupon")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(AddCouponInput),
    uploadHelper("public/coupons").single("coupon"),
    fileValidationMiddleWare,
    addCouponService
  );

export { providersRouter };
