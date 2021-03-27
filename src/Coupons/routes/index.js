import express from "express";
import { CouponValidationWares } from "../middlewares/validation/coupon";
import { CouponController } from "../controllers/index";
import { checkUserAuth } from "../../utils/auth";
import { uploadHelper } from "../../utils/MulterHelper";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    checkUserAuth,
    uploadHelper("Coupons-Images/").single("imgURL"),
    CouponValidationWares.addCoupon,
    CouponController.addCoupon
  );

couponRouter
  .route("/:id/modification")
  .put(
    checkUserAuth,
    uploadHelper("Coupons-Images/").single("imgURL"),
    CouponValidationWares.updateCoupon,
    CouponController.updateCoupon
  );

couponRouter.route("/coupons/:id").get(CouponController.getById);

couponRouter
  .route("/:id/deletion")
  .delete(checkUserAuth, CouponController.deleteCoupon);

couponRouter.use("/coupons-images", express.static("Coupons-Images"));
export { couponRouter };
