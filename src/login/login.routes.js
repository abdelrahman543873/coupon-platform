import express from "express";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { LoginInput } from "./inputs/login.input.js";
import { loginService } from "./login.service.js";
import { langMiddleware } from "../_common/helpers/lang.js";

const loginRouter = express.Router();

loginRouter
  .route("/")
  .post(langMiddleware, ValidationMiddleware(LoginInput), loginService);

export { loginRouter };
