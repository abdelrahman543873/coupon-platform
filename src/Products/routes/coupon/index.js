import express from "express";
import multer from "multer";
import path from "path";
import { CouponValidationWares } from "../../middlewares/validation/coupon";
import { CouponController } from "../../controllers/coupon";
import { isIdAuthMathces } from "../../middlewares/auth";
import { uploadHelper } from "../../../utils/MulterHelper";

const couponRouter = express.Router();
let couponFileName = __filename;

/**
 * @swagger
 *
 * /api/v1/products/coupons/providers/new:
 *  post:
 *     tags:
 *       - Provider
 *     description: Create New Coupon
 *     summary: Create New Coupon
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *              titleEn:
 *                description: title in english
 *                type: string
 *              titleAr:
 *                description: title in arabic
 *                type: string
 *              descriptionEn:
 *                description: description in english
 *                type: string
 *              descriptionAr:
 *                description: description in arabic
 *                type: string
 *              discount:
 *                type: integer
 *              price:
 *                type: integer
 *              expirationDate:
 *                type: date
 *              keyImg:
 *                type: string
 *                format: binary
 *            required:
 *              -bazar
 *              -titleEn
 *              -titleAr
 *              -descriptionEn
 *              -descriptionAr
 *              -discount
 *              -price
 *              -expirationDate
 *              -keyImg
 *     parameters:
 *       - in: header
 *         description: required auth token
 *         name: authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

couponRouter
  .route("/providers/new")
  .post(
    uploadHelper("Coupons-Images/").single("keyImg"),
    isIdAuthMathces,
    CouponValidationWares.addCoupon,
    CouponController.addCoupon
  );

/**
 * @swagger
 *
 * /api/v1/products/coupons/providers:
 *  get:
 *     summary: Get all providers who have coupons
 *     description: Get all providers who have coupons
 *     tags:
 *       - Customers
 *     responses:
 *       200:
 *         description: login
 */
couponRouter.route("/providers").get(CouponController.getCouponsProviders);

/**
 * @swagger
 *
 * /api/v1/products/coupons/modification/:
 *  put:
 *     tags:
 *       - Provider
 *     description: Update Coupon
 *     summary: Update Coupon
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *              titleEn:
 *                description: title in english
 *                type: string
 *              titleAr:
 *                description: title in arabic
 *                type: string
 *              descriptionEn:
 *                description: description in english
 *                type: string
 *              descriptionAr:
 *                description: description in arabic
 *                type: string
 *              discount:
 *                type: integer
 *              expirationDate:
 *                type: date
 *              keyImg:
 *                type: string
 *                format: binary
 *            required:
 *              -bazar
 *
 *     parameters:
 *       - in: header
 *         description: required auth token
 *         name: authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         description: couponId
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
couponRouter
  .route("/modification/")
  .put(
    uploadHelper("Coupons-Images/").single("keyImg"),
    isIdAuthMathces,
    CouponValidationWares.updateCoupon,
    CouponController.updateCoupon
  );

/**
 * @swagger
 *
 * /api/v1/products/coupons/elemination/:
 *  put:
 *     tags:
 *       - Provider
 *     description: Delete Coupon
 *     summary: Delete Coupon
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *            required:
 *              -bazar
 *     parameters:
 *       - in: header
 *         description: required auth token
 *         name: authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         description: coupon id
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
couponRouter
  .route("/elemination")
  .put(isIdAuthMathces, CouponController.deleteCoupon);

/**
 * @swagger
 *
 * /api/v1/products/coupons/providers/coupons/{id}:
 *  get:
 *     summary: Get all providers coupons
 *     description: Get all providers coupons
 *     tags:
 *       - Provider
 *     parameters:
 *       - in: path
 *         description: bazar id
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
couponRouter
  .route("/providers/coupons/:id")
  .get(CouponController.getCouponsByPovider);

couponRouter.use("/coupons-images", express.static("Coupons-Images"));
export { couponRouter, couponFileName };
