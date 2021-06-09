import express from "express";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { ResetPasswordInput } from "./inputs/reset-password.input.js";
import {
  changePasswordService,
  resetPasswordService,
} from "../reset-password/reset-password.service.js";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { ChangePasswordInput } from "./inputs/new-password.input.js";
import { langMiddleware } from "../_common/helpers/lang.js";
const resetPassword = express.Router();

resetPassword
  .route("/")
  .post(
    langMiddleware,
    ValidationMiddleware(ResetPasswordInput),
    resetPasswordService
  );

resetPassword
  .route("/changePassword")
  .post(
    authenticationMiddleware,
    ValidationMiddleware(ChangePasswordInput),
    changePasswordService
  );

export { resetPassword };
