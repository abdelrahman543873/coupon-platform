import express from "express";
import { uploadHelper } from "../utils/MulterHelper.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ProviderRegisterInput } from "./inputs/provider-register.input.js";
import { UpdateProviderInput } from "./inputs/update-provider.input.js";
import {
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
  .route("/modification")
  .put(
    uploadHelper("Providers-Images/").single("logoURL"),
    authenticationMiddleware,
    ValidationMiddleware(UpdateProviderInput),
    updateProviderService
  );

export { providersRouter };
