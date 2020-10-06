import express from "express";
import path from "path";
import { ClientControllers } from "../controllers/client";
import { Validations } from "../middlewares/validations/client";
import { checkCustomerAuth } from "../middlewares/auth";
import { uploadHelper } from "../../utils/MulterHelper";
import { PaymentValidationWare } from "../../Purchasing/middlewares/validations/payment";
import { PaymentController } from "../../Purchasing/controllers/payment";
import { OrderContoller } from "../../Purchasing/controllers/order";
import { isIdAuthMathces } from "../../ProviderManagement/middlewares/auth";
import { CouponPayValidationWare } from "../../Purchasing/middlewares/validations/couponPayment";
import { CouponPayController } from "../../Purchasing/controllers/couponPayment";

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const customerFileName = __filename;
const options = {
  definition: {
    openapi: "3.0.0", // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: "Customers Management", // Title (required)
      version: "1.0.0", // Version (required)
      description: "All Customers Management endpoints.",
    },
  },
  apis: [__filename],
};
const swaggerSpec = swaggerJSDoc(options);

const customersRouter = express.Router();
customersRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/:
 *  post:
 *     tags:
 *       - Customers
 *     description: Register as a customer
 *     summary: Register as a customer
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
 *              password:
 *                type: string
 *              userPic:
 *                type: string
 *                format: binary
 *            required:
 *              -username
 *              -email
 *              -password
 *              -userPic
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers")
  .post(
    uploadHelper("Users-Images").single("userPic"),
    Validations.addClient,
    ClientControllers.add
  );

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/emails/verification:
 *  post:
 *     description: Verify Email
 *     summary:  Verify Email
 *     tags:
 *       - Customers
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
 *         description: right email
 *       404:
 *         description: email not found
 *       422:
 *         description: wrong email format
 *
 */
customersRouter
  .route("/customers/emails/verification")
  .post(Validations.emailVerification, ClientControllers.verifyEmail);

/**
 * @swagger
 *
 * /api/v1/customers-management/auth:
 *  post:
 *     description: login
 *     summary: login
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              -email
 *              -password
 *     responses:
 *       200:
 *         description: login
 *       400:
 *         description: Error email not found
 *       401:
 *         description: Error wrong password
 *       422:
 *         description: Error bad data
 */
customersRouter.route("/auth").post(Validations.login, ClientControllers.auth);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/social-auth:
 *  post:
 *     description: Social login
 *     summary: Social login
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              socialMediaId:
 *                type: string
 *              socialMediaType:
 *                type: string
 *              userPicURL:
 *                type: string
 *            required:
 *              -username
 *              -email
 *              -socialMediaType
 *              -socialMediaId
 *     responses:
 *       200:
 *         description: login
 *       201:
 *         description: Successfully registered
 *       422:
 *         description: Error bad data
 */
customersRouter
  .route("/customers/social-auth")
  .post(Validations.socialAuth, ClientControllers.socialAuth);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/{USER-ID}/mobile:
 *  post:
 *     description: Add Mobile
 *     summary: Add Mobile
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              mobile:
 *                type: string
 *              countryCode:
 *                type: string
 *            required:
 *              -mobile
 *     parameters:
 *       - in: path
 *         name: USER-ID  # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/:id/mobile")
  .post(Validations.addMobile, ClientControllers.addMobile2Verifications);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/{USER-ID}/mobile/verification:
 *  post:
 *     description: Mobile Verification
 *     summary: Mobile Verification
 *     tags:
 *       - Customers
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
 *         name: USER-ID  # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/:id/mobile/verification")
  .post(Validations.verifyMobile, ClientControllers.verifyMobile);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/fav-products/{PRODUCT-ID}:
 *  put:
 *     description: update favourite products
 *     summary: if not exist it will added if exist it will removed
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *     parameters:
 *       - in: path
 *         name: PRODUCT-ID  # Note the name is the same as in the path
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
 *         description: added or removed
 */
customersRouter
  .route("/customers/fav-products/:id")
  .put(checkCustomerAuth, ClientControllers.updateFavProducts);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/fav-products:
 *  get:
 *     description: get user favourite products
 *     summary: get user favourite products
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: user fav product returned
 */
customersRouter
  .route("/customers/fav-products/")
  .get(checkCustomerAuth, ClientControllers.getFavProducts);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/fav-coupons/{COUPON-ID}:
 *  put:
 *     description: update favourite products
 *     summary: if not exist it will added if exist it will removed
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *     parameters:
 *       - in: path
 *         name: COUPON-ID  # Note the name is the same as in the path
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
 *         description: added or removed
 */
customersRouter
  .route("/customers/fav-coupons/:id")
  .put(checkCustomerAuth, ClientControllers.updateFavCoupons);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/fav-coupons:
 *  get:
 *     description: get user favourite coupons
 *     summary: get user favourite coupons
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: user fav coupons returned
 */
customersRouter
  .route("/customers/fav-coupons")
  .get(checkCustomerAuth, ClientControllers.getFavCoupons);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/modification:
 *  put:
 *     tags:
 *       - Customers
 *     description: Edit Customer Profile
 *     summary: Edit Customer Profile
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
 *              mobile:
 *                type: string
 *              countryCode:
 *                type: string
 *              gender:
 *                type: string
 *              imgURL:
 *                type: string
 *                format: binary
 *              deleteImg:
 *                type: boolean
 *     parameters:
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

customersRouter
  .route("/customers/modification")
  .put(
    uploadHelper("Users-Images/").single("imgURL"),
    Validations.updateProfile,
    checkCustomerAuth,
    ClientControllers.updateProfile
  );

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/newPassword:
 *  put:
 *     tags:
 *       - Customers
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

customersRouter
  .route("/customers/newPassword")
  .put(
    Validations.changePassword,
    checkCustomerAuth,
    ClientControllers.changePassword
  );

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/info:
 *  get:
 *     tags:
 *       - Customers
 *     description: get Client info
 *     summary: get client info
 *     parameters:
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
customersRouter
  .route("/customers/info")
  .get(checkCustomerAuth, ClientControllers.getProfile);

/**
 * @swagger
 *
 * /api/v1/customers-management/{id}/verifications/mobile/new:
 *  post:
 *     tags:
 *       - Customers
 *     description: resend sms code
 *     summary: resend sms code
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              mobile:
 *                type: string
 *            required:
 *              -mobile
 *     parameters:
 *       - in: path
 *         name: id
 *         description: client id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         description: code type, send it in case of order code
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: code sent
 */
customersRouter
  .route("/:id/verifications/mobile/new")
  .post(ClientControllers.resendMobileVerification);

/**
 * @swagger
 * /api/v1/customers-management/payment:
 *  post:
 *     tags:
 *       - Customers
 *     description:  Add payment
 *     summary: Add payment
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *               order:
 *                   type: string
 *               type:
 *                   type: string
 *               total:
 *                   type: string
 *               transactionId:
 *                   type: string
 *               accountId:
 *                   type: string
 *               imgURL:
 *                type: string
 *                format: binary
 *            required:
 *               -order
 *               -transactionId
 *               -type
 *               -total
 *               -accountId
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: succeed
 */
customersRouter
  .route("/payment")
  .post(
    checkCustomerAuth,
    uploadHelper("Payments-Images/").single("imgURL"),
    PaymentValidationWare.addPayment,
    PaymentController.addPayment
  );

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/{id}/orders/deliverd/verification:
 *  post:
 *     description: deliverd order Verification
 *     summary: deliverd order Verification
 *     tags:
 *       - Customers
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              smsToken:
 *                type: string
 *              order:
 *                type: string
 *            required:
 *              -smsToken
 *              -order
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description:  client id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/:id/orders/deliverd/verification")
  .post(isIdAuthMathces, OrderContoller.confirmDeliverdOrder);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/{id}/coupons/{couponId}/consumption:
 *  post:
 *     tags:
 *       - Customers
 *     description: consume coupon
 *     summary: consume coupon
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: bazar id
 *                type: string
 *              total:
 *                description: total
 *                type: integer
 *              expirationDate:
 *                description: expiration date
 *                type: date
 *              paymentType:
 *                description: must be SADAD, ONLINE_PAYMENT , BANK_TRANSFER
 *                type: string
 *              transactionId:
 *                description: transaction id
 *                type: string
 *              accountId:
 *                description: id for payment account
 *                type: string
 *              imgURL:
 *                description: bank transfer paymnet screen
 *                type: string
 *                format: binary
 *            required:
 *              -bazar
 *              -total
 *              -expirationDate
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: client id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: couponId
 *         description: coupon id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/:id/coupons/:couponId/consumption")
  .post(
    checkCustomerAuth,
    uploadHelper("Payments-Images/").single("imgURL"),
    CouponPayValidationWare.add,
    CouponPayController.add
  );

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/{id}/coupons/counsumed:
 *  get:
 *     tags:
 *       - Customers
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
 *         description: client id
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
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/:id/coupons/counsumed")
  .get(checkCustomerAuth, CouponPayController.getConsumedCoupons);

/**
 * @swagger
 *
 * /api/v1/customers-management/customers/questions:
 *  get:
 *     tags:
 *       - Customers
 *     description: Get FQA
 *     summary: Get FQA
 *     responses:
 *       200:
 *         description: login
 */
customersRouter
  .route("/customers/questions")
  .get(ClientControllers.getFamiliarQuestions);

customersRouter.use("/user-image", express.static("Users-Images"));

export { customersRouter, customerFileName };
