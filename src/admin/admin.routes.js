import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import {
  addAdminService,
  manageProviderStatusService,
} from "./admin.service.js";
import { AddAdminInput } from "./inputs/add-admin.input.js";
import { ApproveProviderInput } from "./inputs/manage-provider-status.input.js";

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
  .route("/manageProviderStatus")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(ApproveProviderInput),
    manageProviderStatusService
  );

export { adminRouter };
