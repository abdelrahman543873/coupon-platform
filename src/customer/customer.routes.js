import express from "express";
import {
  fileValidationMiddleWare,
  uploadHelper,
} from "../_common/upload/uploader.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { CustomerRegisterService } from "./customer.service.js";
import { CustomerRegisterInput } from "./inputs/customer-register.input.js";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(
    ValidationMiddleware(CustomerRegisterInput),
    uploadHelper("public/profile-pictures").single("profile-picture"),
    fileValidationMiddleWare,
    CustomerRegisterService
  );

export { customersRouter };
