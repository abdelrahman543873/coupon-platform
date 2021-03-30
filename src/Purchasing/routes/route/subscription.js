import express from "express";
import { checkUserAuth } from "../../../utils/auth.js";
import { uploadHelper } from "../../../utils/MulterHelper.js";
import { subscriptionContoller } from "../../controllers/subscription.js";
import { SubscriptionValidationWares } from "../../middlewares/subscription.js";

const subscriptionRouter = express.Router();

subscriptionRouter
  .route("/")
  .post(
    checkUserAuth,
    uploadHelper("Subscriptions-Images/").single("imgURL"),
    SubscriptionValidationWares.subscripe,
    subscriptionContoller.subscripe
  );

subscriptionRouter
  .route("/")
  .get(checkUserAuth, subscriptionContoller.getAllSubscriptions);

subscriptionRouter
  .route("/:id")
  .get(checkUserAuth, subscriptionContoller.getById);
export { subscriptionRouter };
