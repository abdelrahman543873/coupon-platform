import express from "express";
import { CouponValidationWares } from "../middlewares/validation/coupon";
import { CouponController } from "../controllers/index";
import { checkUserAuth } from "../../utils/auth";
import { uploadHelper } from "../../utils/MulterHelper";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    uploadHelper("Coupons-Images/").single("imgURL"),
    checkUserAuth,
    CouponValidationWares.addCoupon,
    CouponController.addCoupon
  );

couponRouter.use("/coupons-images", express.static("Coupons-Images"));
export { couponRouter };
