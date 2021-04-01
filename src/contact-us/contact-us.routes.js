import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication";
import { ValidationMiddleware } from "../_common/validation.middleware";
import { sendContactUsMessageService } from "./contact-us.service";
import { contactUsInput } from "./inputs/contact-us.input";

const contactUsRouter = express.Router();

contactUsRouter
  .route("/")
  .post(
    ValidationMiddleware(contactUsInput),
    authenticationMiddleware,
    sendContactUsMessageService
  );
export { contactUsRouter };
