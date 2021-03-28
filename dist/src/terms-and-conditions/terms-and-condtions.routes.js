import { Router } from "express";
import { addTermsAndConditionsService, getTermsAndConditionsService } from "./terms-and-conditions.service.js";
const termsAndConditionsRouter = Router();
termsAndConditionsRouter.post("/addTermsAndConditions", addTermsAndConditionsService);
termsAndConditionsRouter.get("/getTermsAndConditions", getTermsAndConditionsService);
export { termsAndConditionsRouter };