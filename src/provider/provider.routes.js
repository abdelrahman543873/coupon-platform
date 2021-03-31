import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { uploadHelper } from "../utils/MulterHelper.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ProviderRegisterInput } from "./inputs/provider-register.input.js";
import { UpdateProviderInput } from "./inputs/update-provider.input.js";
import {
  getProviderService,
  providerRegisterService,
  updateProviderService,
} from "./provider.service.js";

const providersRouter = express.Router();

providersRouter
  .route("/")
  .post(
    uploadHelper("Providers-Images/").single("logoURL"),
    ValidationMiddleware(ProviderRegisterInput),
    providerRegisterService
  );

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
    uploadHelper("Providers-Images/").single("logoURL"),
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[0]),
    ValidationMiddleware(UpdateProviderInput),
    updateProviderService
  );

export { providersRouter };
