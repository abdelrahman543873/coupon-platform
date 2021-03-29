import express from "express";
import { uploadHelper } from "../utils/MulterHelper.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ProviderRegisterInput } from "./inputs/provider-register.input.js";
import { providerRegisterService } from "./provider.service.js";

const providersRouter = express.Router();

providersRouter
  .route("/")
  .post(
    uploadHelper("Providers-Images/").single("logoURL"),
    ValidationMiddleware(ProviderRegisterInput),
    providerRegisterService
  );

export { providersRouter };
