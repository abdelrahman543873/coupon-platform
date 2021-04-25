import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ProviderRegisterInput } from "./inputs/provider-register.input.js";
import { UpdateProviderInput } from "./inputs/update-provider.input.js";
import { AddCouponInput } from "./inputs/add-coupon.input.js";
import {
  addCouponService,
  deleteCouponService,
  deleteLocationService,
  getMyCouponsService,
  getProviderService,
  providerRegisterService,
  updateCouponService,
  updateProviderService,
} from "./provider.service.js";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
import { UpdateCouponInput } from "./inputs/update-coupon.input.js";
import { GetSubscriptionInput } from "./inputs/get-subscription.input.js";
import { getCategoriesService } from "../category/category.service.js";
import { DeleteCouponInput } from "../admin/inputs/delete-coupon.input.js";
import { addLocationService } from "./provider.service.js";
import { AddLocationInput } from "./inputs/add-location.input.js";
import {
  getProviderHomeService,
  getSubscriptionsService,
} from "../subscription/subscription.service.js";
import { getSubscriptionService } from "../subscription/subscription.service.js";
import { offSetLimitInput } from "../_common/helpers/limit-skip-validation.js";

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
    uploadHelper("public/logos").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(UpdateProviderInput),
    updateProviderService
  );

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
  .route("/addCoupon")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    uploadHelper("public/coupons").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(AddCouponInput),
    addCouponService
  );

providersRouter
  .route("/deleteCoupon")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(DeleteCouponInput),
    deleteCouponService
  );

providersRouter
  .route("/updateCoupon")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    uploadHelper("public/coupons").single("image"),
    fileValidationMiddleWare,
    ValidationMiddleware(UpdateCouponInput),
    updateCouponService
  );

providersRouter
  .route("/getSubscriptions")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    getSubscriptionsService
  );

providersRouter
  .route("/getSubscription")
  .get(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(GetSubscriptionInput),
    getSubscriptionService
  );

providersRouter
  .route("/addLocation")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(AddLocationInput),
    addLocationService
  );

providersRouter
  .route("/getCategories")
  .get(ValidationMiddleware(offSetLimitInput), getCategoriesService);

providersRouter
  .route("/deleteLocation")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(AddLocationInput),
    deleteLocationService
  );

export { providersRouter };
