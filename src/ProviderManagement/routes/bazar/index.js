import express, { Router } from "express";
import { uploadHelper } from "../../../utils/MulterHelper";
import { BazarControllers } from "../../controllers/Bazar";
import { BazarValidationWares } from "../../middlewares/validations/bazar";
import { isIdAuthMathces } from "../../middlewares/auth";
import { ProviderValidationWares } from "../../middlewares/validations/provider";
import { AdsController } from "../../controllers/Ads";
import { AdsValidationWares } from "../../middlewares/validations/ads";
import { PaymentController } from "../../../Purchasing/controllers/payment";
import { OrderContoller } from "../../../Purchasing/controllers/order";
import { AdsPayController } from "../../../Purchasing/controllers/adsPayment";
import { AdsPayValidationWare } from "../../../Purchasing/middlewares/validations/adsPayment";

const bazarsRouter = Router();
const bazarFilename = __filename;
/**
 * @swagger
 * /api/v1/providers-management/bazars:
 *   get:
 *     tags:
 *       - Customers
 *     description:  Get all bazars
 *     summary: Get All Bazars
 *     parameters:
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: PRODUCTIVE_FAMILY / BAZAR / COUPONS_PROVIDER
 *      - in: query
 *        name: wProvider
 *        schema:
 *          type: boolean
 *        description: if u need provider true else false
 *      - in: query
 *        name: featured
 *        schema:
 *          type: boolean
 *        description: if true ads returned
 *      - in: query
 *        name: cntItms
 *        schema:
 *          type: boolean
 *        description: if u need items true else false
 *     responses:
 *        200:
 *           description: Ok
 */
bazarsRouter.route("/").get(BazarControllers.getBazars);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/new/{id}:
 *  post:
 *     tags:
 *       - Provider
 *     description: Create New Bazar
 *     summary: Create New Bazar
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              name:
 *                description: require bazar Name and must be Unique
 *                type: string
 *              officeTele:
 *                type: string
 *              cityId:
 *                description: require city id
 *                type: string
 *              districtId:
 *                description: require districts id's
 *                type: array
 *              slogan:
 *                type: string
 *              logoURL:
 *                type: string
 *                format: binary
 *              type:
 *                description: Must me PRODUCTIVE_FAMILY / BAZAR / COUPONS_PROVIDER
 *                type: string
 *              businessYearsNumber:
 *                type: string
 *              paymentType:
 *                description: Payment Type
 *                type: array
 *                items:
 *                  type: string
 *              lat:
 *                description: location lat
 *                type: string
 *              lng:
 *                description: location lng
 *                type: string
 *              facebookLink:
 *                type: string
 *              instaLink:
 *                type: string
 *              websiteLink:
 *                type: string
 *            required:
 *              -paymentType
 *              -name
 *              -provider
 *              -officeTele
 *              -cityId
 *              -districtId
 *              -slogan
 *              -logoURL
 *              -type
 *              -businessYearsNumber
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
bazarsRouter
  .route("/providers/new/:id")
  .post(
    uploadHelper("Bazars-Images/").single("logoURL"),
    isIdAuthMathces,
    BazarValidationWares.addBazar,
    BazarControllers.addBazar
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/resources/new/{id}:
 *  post:
 *     tags:
 *       - Provider
 *     description: Add Resources
 *     summary: Add Resources
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
 *              phone:
 *                type: string
 *              countryCode:
 *                type: string
 *              password:
 *                type: string
 *              gender:
 *                type: string
 *              roles:
 *                description: Must be BAZAR_PRODUCTS_EDITOR / BAZAR_ORDER_HANDLER" / BAZAR_CUSTOMER_SERVICE
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
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: bazar owner id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/resources/new/:id")
  .post(
    uploadHelper("Providers-Images/").single("imgURL"),
    isIdAuthMathces,
    ProviderValidationWares.add,
    BazarControllers.addResource
  );

/**
 * @swagger
 * /api/v1/providers-management/bazars/resources/{id}:
 *   get:
 *     tags:
 *       - Provider
 *     description:  Get all resources
 *     summary: Get All resources
 *     parameters:
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: bazarId
 *         description: bazar id
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
 *         description: succeed
 */
bazarsRouter
  .route("/resources/:id")
  .get(isIdAuthMathces, BazarControllers.getResources);

/**
 * @swagger
 * /api/v1/providers-management/bazars/resources/activation/{id}:
 *   put:
 *     tags:
 *       - Provider
 *     description:  Set Resource On Off
 *     summary: Set Resource On Off
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              resourceID:
 *                type: string
 *                description: resource ID
 *              isActive:
 *                type: boolean
 *                description: true or false
 *            required:
 *              -isActive
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
 *         description: succeed
 */
bazarsRouter
  .route("/resources/activation/:id")
  .put(isIdAuthMathces, BazarControllers.setActivation);

/**
 * @swagger
 * /api/v1/providers-management/bazars/resources/elimination/{id}:
 *   put:
 *     tags:
 *       - Provider
 *     description:  Delete Resource
 *     summary:  Delete Resource
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              resourceID:
 *                type: string
 *                description: resource ID
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
 *         description: succeed
 */
bazarsRouter
  .route("/resources/elimination/:id")
  .put(isIdAuthMathces, BazarControllers.deleteResource);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/resources/modification/{id}:
 *  put:
 *     tags:
 *       - Provider
 *     description: Edit Resource
 *     summary: Edit resource
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
 *              phone:
 *                type: string
 *              countryCode:
 *                type: string
 *              gender:
 *                type: string
 *              roles:
 *                description: Must be BAZAR_PRODUCTS_EDITOR / BAZAR_ORDER_HANDLER" / BAZAR_CUSTOMER_SERVICE
 *                type: array
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
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: resourceID
 *         description: resource id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

bazarsRouter
  .route("/resources/modification/:id")
  .put(
    isIdAuthMathces,
    uploadHelper("Providers-Images/").single("imgURL"),
    ProviderValidationWares.updateProviderPersonal,
    BazarControllers.updateResourcePersonal
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/resources/newPassword/{id}:
 *  put:
 *     tags:
 *       - Provider
 *     description: Change Resource password
 *     summary: Change Resource password
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
 *       - in: path
 *         name: id
 *         description: provider id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: resourceID
 *         description: resource id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

bazarsRouter
  .route("/resources/newPassword/:id")
  .put(
    isIdAuthMathces,
    ProviderValidationWares.changePassword,
    BazarControllers.changePassword
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/modification/{id}:
 *  put:
 *     tags:
 *       - Provider
 *     description: Edit Bazar Info
 *     summary: Edit Bazar Info
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              name:
 *                description: require bazar Name and must be Unique
 *                type: string
 *              officeTele:
 *                type: string
 *              cityId:
 *                description: require city id
 *                type: string
 *              districtId:
 *                description: require districts id's
 *                type: array
 *              slogan:
 *                type: string
 *              logoURL:
 *                type: string
 *                format: binary
 *              businessYearsNumber:
 *                type: string
 *              lat:
 *                description: location lat
 *                type: string
 *              lng:
 *                description: location lng
 *                type: string
 *              facebookLink:
 *                type: string
 *              instaLink:
 *                type: string
 *              websiteLink:
 *                type: string
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
 *       - in: query
 *         name: bazarId
 *         description: bazar id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/modification/:id")
  .put(
    uploadHelper("Bazars-Images/").single("logoURL"),
    isIdAuthMathces,
    BazarValidationWares.editBazarInfo,
    BazarControllers.editBazarInfo
  );

/**
 * @swagger
 * /api/v1/providers-management/bazars:
 *   get:
 *     tags:
 *       - Customers
 *     description:  Get all bazars
 *     summary: Get All Bazars
 *     parameters:
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: PRODUCTIVE_FAMILY / BAZAR / COUPONS_PROVIDER
 *      - in: query
 *        name: wProvider
 *        schema:
 *          type: boolean
 *        description: if u need provider true else false
 *      - in: query
 *        name: cntItms
 *        schema:
 *          type: boolean
 *        description: if u need items true else false
 *      - in: query
 *        name: featured
 *        schema:
 *          type: boolean
 *        description: if true ads returned
 *     responses:
 *        200:
 *           description: Ok
 */
bazarsRouter.route("/").get(BazarControllers.getBazars);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/ads/new/{id}:
 *  post:
 *     tags:
 *       - Provider
 *     description: Create Ads
 *     summary: Create Ads
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazarId:
 *                description: require bazar id
 *                type: string
 *              descriptionAr:
 *                type: string
 *              descriptionEn:
 *                type: string
 *              pakageId:
 *                type: string
 *              adURL:
 *                type: string
 *                format: binary
 *            required:
 *              -bazarId
 *              -descriptionAr
 *              -descriptionEn
 *              -pakageId
 *              -adURL
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
bazarsRouter
  .route("/ads/new/:id")
  .post(
    uploadHelper("Bazars-Ads/").single("adURL"),
    isIdAuthMathces,
    AdsValidationWares.addAds,
    AdsController.add
  );

/**
 * @swagger
 * /api/v1/providers-management/bazars/payments:
 *   get:
 *     tags:
 *       - Provider
 *     description:
 *     summary: Get availble Payment
 *     parameters:
 *       - in: query
 *         name: type
 *         description: bazar type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: succeed
 */
bazarsRouter.route("/payments").get(BazarControllers.getAvailablePayment);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/bankAccount:
 *  post:
 *     tags:
 *       - Provider
 *     description: Add Bank Account
 *     summary: Add Bank Account
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              accountNumber:
 *                type: string
 *              bankName:
 *                type: string
 *              bankAgentName:
 *                type: string
 *              city:
 *                type: string
 *              country:
 *                type: string
 *              bazar:
 *                type: string
 *              swiftCode:
 *                type: string
 *            required:
 *              -accountNumber
 *              -bankName
 *              -bankAgentName
 *              -city
 *              -country
 *              -bazar
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
bazarsRouter
  .route("/providers/:id/bankAccount")
  .post(
    isIdAuthMathces,
    BazarValidationWares.addBankAccount,
    BazarControllers.addBanckAccount
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/creditCard:
 *  post:
 *     tags:
 *       - Provider
 *     description: Add credit card
 *     summary: Add credit card
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              merchantEmail:
 *                type: string
 *              secretKey:
 *                type: string
 *              bazar:
 *                type: string
 *            required:
 *              -merchantEmail
 *              -secretKey
 *              -bazar
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
bazarsRouter
  .route("/providers/:id/creditCard")
  .post(
    isIdAuthMathces,
    BazarValidationWares.addCreditCard,
    BazarControllers.addCreditCard
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/payments/modification:
 *  put:
 *     tags:
 *       - Provider
 *     description: update payment wayes
 *     summary:  update payment wayes
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              paymentType:
 *                type: array
 *                items:
 *                  type: string
 *              bazar:
 *                type: string
 *            required:
 *              -paymentType
 *              -bazar
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
bazarsRouter
  .route("/providers/:id/payments/modification")
  .put(
    isIdAuthMathces,
    BazarValidationWares.editPaymentTypes,
    BazarControllers.editPayments
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/bankAccounts/{bankId}:
 *  put:
 *     tags:
 *       - Provider
 *     description: update Bank Accounts
 *     summary:  update Bank Accounts
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              state:
 *                type: boolean
 *              bazar:
 *                type: string
 *            required:
 *              -state
 *              -paymentType
 *              -bazar
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
 *         name: bankId
 *         description: Bank id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/providers/:id/bankAccounts/:bankId")
  .put(isIdAuthMathces, BazarControllers.toggleBankAccount);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/orders/{orderId}/state:
 *  post:
 *     tags:
 *       - Provider
 *     description: change order state
 *     summary: change order state
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              state:
 *                type: string
 *            required:
 *              -state
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
 *         name: orderId
 *         description: order id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: note
 *         description: notes for refused orders
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/providers/:id/orders/:orderId/state")
  .post(
    isIdAuthMathces,
    BazarValidationWares.changeOrderState,
    BazarControllers.changeOrderState
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/{bazar}/providers/{id}/payments/:
 *  get:
 *     tags:
 *       - Provider
 *     description: get unconfirmed payments
 *     summary: get unconfirmed payments
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
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/:bazar/providers/:id/payments/")
  .get(isIdAuthMathces, PaymentController.getUnConfirmedPayment);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/payments/{payment}/confirmation:
 *  put:
 *     tags:
 *       - Provider
 *     description: confirme payment
 *     summary: confirme payment
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
 *         name: payment
 *         description: payment id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/providers/:id/payments/:payment/confirmation")
  .put(isIdAuthMathces, PaymentController.paymentConfirmation);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/payments/{payment}/rejection:
 *  put:
 *     tags:
 *       - Provider
 *     description: reject payment
 *     summary: reject payment
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
 *         name: payment
 *         description: payment id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/providers/:id/payments/:payment/rejection")
  .put(isIdAuthMathces, PaymentController.paymentRejection);
/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/providers/{id}/orders/{order}/confirmation:
 *  put:
 *     tags:
 *       - Provider
 *     description: confirme order
 *     summary: confirme order
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
 *         name: order
 *         description: order id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/providers/:id/orders/:order/confirmation")
  .put(isIdAuthMathces, OrderContoller.orderConfirmation);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/{bazar}/providers/{id}/orders/statistics:
 *  get:
 *     tags:
 *       - Provider
 *     description: bazar order statistics
 *     summary: bazar order statistics
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
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/:bazar/providers/:id/orders/statistics")
  .get(isIdAuthMathces, BazarControllers.getOrderStatistics);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/questions:
 *  get:
 *     tags:
 *       - Provider
 *     description: Get FQA
 *     summary: Get FQA
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter.route("/questions").get(BazarControllers.getFamiliarQuestions);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/packages:
 *  get:
 *     tags:
 *       - Provider
 *     description: Get Packages
 *     summary: Get Packages
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter.route("/packages").get(BazarControllers.getAdsPackages);

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/{bazar}/providers/{id}/ads/payment:
 *  post:
 *     tags:
 *       - Provider
 *     description: Pay Ad
 *     summary: Pay Ad
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              adId:
 *                description: ad id
 *                type: string
 *              total:
 *                description: total
 *                type: integer
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
 *              -adId
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
 *         name: bazar
 *         description: bazar id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/:bazar/providers/:id/ads/payment")
  .post(
    isIdAuthMathces,
    uploadHelper("AdsPayments-Images/").single("imgURL"),
    AdsPayValidationWare.add,
    AdsPayController.add
  );

/**
 * @swagger
 *
 * /api/v1/providers-management/bazars/{bazar}/providers/{id}/coupons/statistics:
 *  get:
 *     tags:
 *       - Provider
 *     description: bazar coupons statistics
 *     summary: bazar coupons statistics
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
 *     responses:
 *       200:
 *         description: login
 */
bazarsRouter
  .route("/:bazar/providers/:id/coupons/statistics")
  .get(isIdAuthMathces, BazarControllers.getCouponsStatistics);

bazarsRouter.use("/bazars-images", express.static("Bazars-Images"));
bazarsRouter.use("/bazars-ads", express.static("Bazars-Ads"));
export { bazarsRouter, bazarFilename };
