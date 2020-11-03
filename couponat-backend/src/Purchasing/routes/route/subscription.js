import { Router } from "express";
import { checkUserAuth } from "../../../utils/auth";
import { uploadHelper } from "../../../utils/MulterHelper";
import { subscriptionContoller } from "../../controllers/subscription";
import { SubscriptionValidationWares } from "../../middlewares/subscription";

const subscriptionRouter = Router();

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

export { subscriptionRouter };
