import express from "express";
import path from "path";
import { ProviderControllers } from "../../controllers/Provider";
import { ProviderValidationWares } from "../../middlewares/validations/provider";
import { isIdAuthMathces } from "../../middlewares/auth";
import { AdsController } from "../../controllers/Ads";
import { uploadHelper } from "../../../utils/MulterHelper";
import { BazarControllers } from "../../controllers/Bazar";
import { AdminsController } from "../../../Admin&PlatformSpec/controllers/Admin/admin";
import { ProviderModule } from "../../modules/provider";

const providersRouter = express.Router();
const providerFilename = __filename;
/**
 * @swagger
 *
 * /api/v1/providers-management/providers/:
 *  post:
 *     tags:
 *       - Provider
 *     description: Register to the application as provider
 *     summary: Register to the application as provider
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              countryCode:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *              gender:
 *                type: string
 *              roles:
 *                description: Must be BAZAR_CREATOR
 *                type: array
 *              imgURL:
 *                type: string
 *                format: binary
 *            required:
 *              -gender
 *              -username
 *              -phone
 *              -countryCode
 *              -email
 *              -password
 *              -roles
 *     responses:
 *       200:
 *         description: login
 */
providersRouter
  .route("/")
  .post(
    uploadHelper("Providers-Images/").single("imgURL"),
    ProviderValidationWares.add,
    ProviderControllers.addProvider
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/emails/verification:
 *  post:
 *     tags:
 *       - Provider
 *     description: Email Verification
 *     summary: Email Verification
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *            required:
 *              -email
 *     responses:
 *       200:
 *         description: login
 */
providersRouter
  .route("/emails/verification")
  .post(
    ProviderValidationWares.emailVerification,
    ProviderControllers.emailVerification
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/auth:
 *  post:
 *     tags:
 *       - Provider
 *     description: login
 *     summary: login
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              firstCardinality:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              -firstCardinality
 *              -password
 *     responses:
 *       200:
 *         description: login
 */
providersRouter
  .route("/auth")
  .post(ProviderValidationWares.login, ProviderControllers.login);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/verifications/mobile:
 *  post:
 *     tags:
 *       - Provider
 *     description: verify provider mobile
 *     summary: verify provider mobile
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              smsToken:
 *                type: string
 *            required:
 *              -smsToken
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: verified
 */
providersRouter
  .route("/:id/verifications/mobile")
  .post(
    ProviderValidationWares.mobileVerification,
    ProviderControllers.verifyMobile
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/verifications/mobile/new:
 *  post:
 *     tags:
 *       - Provider
 *     description: resend sms code
 *     summary: resend sms code
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: code sent
 */
providersRouter
  .route("/:id/verifications/mobile/new")
  .post(isIdAuthMathces, ProviderControllers.resendMobileVerification);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/modification/{id}:
 *  put:
 *     tags:
 *       - Provider
 *     description: Edit Provider Profile
 *     summary: Edit Provider Profile
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              countryCode:
 *                type: string
 *              phone:
 *                type: string
 *              gender:
 *                type: string
 *              imgURL:
 *                type: string
 *                format: binary
 *              deleteImg:
 *                type: boolean
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

providersRouter
  .route("/modification/:id")
  .put(
    isIdAuthMathces,
    uploadHelper("Providers-Images/").single("imgURL"),
    ProviderValidationWares.updateProviderPersonal,
    ProviderControllers.updatePersonal
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/newPassword/{id}:
 *  put:
 *     tags:
 *       - Provider
 *     description: Change password
 *     summary: Change password
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              currentPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *            required:
 *              -currentPassword
 *              -newPassword
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

providersRouter
  .route("/newPassword/:id")
  .put(
    isIdAuthMathces,
    ProviderValidationWares.changePassword,
    ProviderControllers.changePassword
  );

providersRouter.use("/providers-images", express.static("Providers-Images"));

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}:
 *  get:
 *     tags:
 *       - Provider
 *     description: get provider info
 *     summary: get provider info
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
providersRouter
  .route("/:id")
  .get(isIdAuthMathces, ProviderControllers.getProfileInfo);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/ads:
 *  get:
 *     tags:
 *       - Provider
 *     description: get provider ads
 *     summary: get provider ads
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

providersRouter
  .route("/:id/ads")
  .get(isIdAuthMathces, AdsController.getBazarAds);

/**
 * @swagger
 * /api/v1/providers-management/providers/{id}/orders:
 *  get:
 *     tags:
 *       - Provider
 *     description:  Get bazar orders
 *     summary: Get bazar orders
 *     parameters:
 *      - in: path
 *        name: id
 *        description: bazar id
 *        required: true
 *        schema:
 *         type: string
 *      - in: header
 *        name: authentication
 *        description: authentication token
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: clientId
 *        schema:
 *          type: string
 *        description: client id
 *      - in: query
 *        name: state
 *        schema:
 *          type: string
 *        description: must be CONFIRMATION PENDING , REFUSED , PAYMENT PENDING , ACCEPTED , CANCELED , SHIPPED TO USER ADDRESS , DELIVERED
 *     responses:
 *        200:
 *           description: Ok
 */
providersRouter
  .route("/:id/orders")
  .get(isIdAuthMathces, ProviderControllers.getOrderesList);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/bazars/{bazar}/coupons/consumed:
 *  get:
 *     tags:
 *       - Provider
 *     description: get consumed coupons
 *     summary: get consumed coupons
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bazar
 *         description: bazar id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: confirmed
 *         description: confirmed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: expired
 *         description: expired
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: clientId
 *         description: client id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

providersRouter
  .route("/:id/bazars/:bazar/coupons/consumed")
  .get(isIdAuthMathces, BazarControllers.getConsumedCoupons);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/bazars/coupons/consumed/{paymentId}/confirmation:
 *  post:
 *     tags:
 *       - Provider
 *     description: confirm coupon payment
 *     summary: confirm coupon payment
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paymentId
 *         description: coupon payment id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: confirm
 *         description:  send it in case of refuse payment
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: note
 *         description: note
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
providersRouter
  .route("/:id/bazars/coupons/consumed/:paymentId/confirmation")
  .post(isIdAuthMathces, BazarControllers.confirmCouponPayment);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/app/cridit:
 *  get:
 *     tags:
 *       - Provider
 *     description: Get App cridit account
 *     summary: Get App cridit account
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
providersRouter.route("/:id/app/cridit").get(AdminsController.getCriditAcount);

/**
 * @swagger
 *
 * /api/v1/providers-management/providers/{id}/app/banks:
 *  get:
 *     tags:
 *       - Provider
 *     description: Get App banks accounts
 *     summary: Get App banks acounts
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
providersRouter.route("/:id/app/banks").get(ProviderControllers.getAppBanks);
export { isIdAuthMathces, providersRouter, providerFilename };
