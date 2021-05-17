import express from "express";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { authorizationMiddleware } from "../_common/helpers/authorization.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { AddTermsAndConditionsInput } from "./inputs.ts/add-terms-and-conditions.input.js";
import { UpdateTermsAndConditionsInput } from "./inputs.ts/update-terms-and-conditions.input.js";
import {
  addTermsAndConditionsService,
  getTermsAndConditionsService,
  updateTermsAndConditionsService,
} from "./terms-and-conditions.service.js";
import { semiAuthenticationMiddleware } from "../_common/helpers/semi-authentication.js";

const termsAndConditionsRouter = express.Router();

termsAndConditionsRouter
  .route("/addTermsAndConditions")
  .post(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(AddTermsAndConditionsInput),
    addTermsAndConditionsService
  );

termsAndConditionsRouter
  .route("/updateTermsAndConditions")
  .put(
    authenticationMiddleware,
    authorizationMiddleware(UserRoleEnum[2]),
    ValidationMiddleware(UpdateTermsAndConditionsInput),
    updateTermsAndConditionsService
  );

termsAndConditionsRouter
  .route("/getTermsAndConditions")
  .get(getTermsAndConditionsService);

export { termsAndConditionsRouter };
