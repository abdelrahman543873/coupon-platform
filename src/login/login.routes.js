import express from "express";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import { LoginInput } from "./inputs/login.input.js";
import { loginService } from "./login.servicer.js";

const loginRouter = express.Router();

loginRouter.route("/").post(ValidationMiddleware(LoginInput), loginService);

export { loginRouter };
