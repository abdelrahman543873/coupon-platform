import express from "express";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ResetPasswordInput } from "./inputs/reset-password.input.js";
import { resetPasswordService } from "../reset-password/reset-password.service.js";
const resetPassword = express.Router();

resetPassword
  .route("/")
  .post(ValidationMiddleware(ResetPasswordInput), resetPasswordService);

export { resetPassword };
