import { Router } from "express";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { AddTermsAndConditionsInput } from "./inputs.ts/add-terms-and-conditions.input.js";
import {
  addTermsAndConditionsService,
  getTermsAndConditionsService,
} from "./terms-and-conditions.service.js";

const termsAndConditionsRouter = Router();

termsAndConditionsRouter.post(
  "/addTermsAndConditions",
  ValidationMiddleware(AddTermsAndConditionsInput),
  addTermsAndConditionsService
);

termsAndConditionsRouter.get(
  "/getTermsAndConditions",
  getTermsAndConditionsService
);
export { termsAndConditionsRouter };
