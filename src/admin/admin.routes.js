import express from "express";
import {
  addCategoryService,
  updateCategoryService,
} from "../category/category.service.js";
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
} from "./admin.service.js";
import { AddAdminInput } from "./inputs/add-admin.input.js";
import { AddCategoryInput } from "./inputs/add-category.input.js";
import { AddProviderInput } from "./inputs/add-provider.input.js";
import { ApproveProviderInput } from "./inputs/manage-provider-status.input.js";
import { UpdateCategoryInput } from "./inputs/update-category.input.js";
const adminRouter = express.Router();

adminRouter
  .route("/addAdmin")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[3]),
    ValidationMiddleware(AddAdminInput),
    addAdminService
  );

adminRouter
  .route("/addCategory")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/category-pictures").single("category"),
    fileValidationMiddleWare,
    ValidationMiddleware(AddCategoryInput),
    addCategoryService
  );

adminRouter
  .route("/updateCategory")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    uploadHelper("public/category-pictures").single("category"),
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
  .route("/addProvider")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddProviderInput),
    addProviderService
  );

export { adminRouter };
