import express from "express";
import { authenticationMiddleware } from "../_common/helpers/authentication.js";
import { ValidationMiddleware } from "../_common/validation.middleware.js";
import {
  deleteContactUsMessageService,
  sendContactUsMessageService,
} from "./contact-us.service.js";
import { contactUsInput } from "./inputs/contact-us.input.js";
import { DeleteContactUsInput } from "./inputs/delete-contact-us.input.js";
const contactUsRouter = express.Router();

contactUsRouter
  .route("/")
  .post(
    ValidationMiddleware(contactUsInput),
    authenticationMiddleware,
    sendContactUsMessageService
  );

contactUsRouter
  .route("/deleteContactUsMessage")
  .delete(
    authenticationMiddleware,
    ValidationMiddleware(DeleteContactUsInput),
    deleteContactUsMessageService
  );
export { contactUsRouter };
