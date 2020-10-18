import express, { Router } from "express";
import { AdminBazarsController } from "../../controllers/Admin/bazars";
import { uploadHelper } from "../../../utils/MulterHelper";
import { OfferController } from "../../../Products/controllers/offers";

const bazarsRouter = Router();

/**
 * @swagger
 * /api/v1/admins/bazars:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get Bazars
 *     summary: Get Bazars
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *          type: integer
 *         description: pagination limit
 *       - in: query
 *         name: skip
 *         schema:
 *          type: integer
 *         description: pagination skip
 *       - in: query
 *         name: type
 *         schema:
 *          type: string
 *         description: bazar type
 *       - in: query
 *         name: accepted
 *         schema:
 *           type: boolean
 *         description: if not provided all bazars return, true for accepted bazars
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
bazarsRouter.route("/").get(AdminBazarsController.getBazars);

/**
 * @swagger
 * /api/v1/admins/bazars/ads:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get Ads
 *     summary: Get Ads
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *          type: date
 *         description: select with date
 *       - in: query
 *         name: isPaid
 *         schema:
 *          type: boolean
 *         description: select with isPaid ads
 *       - in: query
 *         name: isAccepted
 *         schema:
 *           type: boolean
 *         description: select with is accepted
 *       - in: query
 *         name: bazar
 *         schema:
 *           type: string
 *         description: select with bazar id
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
bazarsRouter.route("/ads").get(AdminBazarsController.getAds);

/**
 * @swagger
 * /api/v1/admins/bazars/{id}/verification:
 *   post:
 *     tags:
 *       - Admin
 *     description:  accept or deny bazar
 *     summary: accept or deny bazar
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *               isAccepted:
 *                   type: boolean
 *            required:
 *               -isAccepted
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
bazarsRouter
  .route("/:id/verification")
  .post(AdminBazarsController.bazarVerification);

/**
 * @swagger
 * /api/v1/admins/bazars/ads/{id}/verification:
 *   post:
 *     tags:
 *       - Admin
 *     description:  accept or deny ads
 *     summary: accept or deny ads
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *               isAccepted:
 *                   type: boolean
 *            required:
 *               -isAccepted
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
bazarsRouter
  .route("/ads/:id/verification")
  .post(AdminBazarsController.adsVerification);

  /**
 * @swagger
 * /api/v1/admins/bazars/ads/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get add by id
 *     summary: get ad by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description:  ad id
 *         schema:
 *           type: string
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
bazarsRouter.route("/ads/:id").get(AdminBazarsController.getAdById);

//bazarsRouter.route("");
/**
 * @swagger
 * /api/v1/admins/bazars/statistics:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get Bazars
 *     summary: Get Bazars
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
bazarsRouter.route("/statistics").get(AdminBazarsController.getStatistics);

/**
 * @swagger
 * /api/v1/admins/bazars/clients:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get clients
 *     summary: Get clients
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
bazarsRouter.route("/clients").get(AdminBazarsController.getClients);

/**
 * @swagger
 * /api/v1/admins/bazars/orders:
 *  get:
 *     tags:
 *       - Admin
 *     description:  Get All orders
 *     summary: Get All orders
 *     parameters:
 *      - in: header
 *        name: authentication
 *        description: authentication token
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: bazar
 *        description: bazar id
 *        schema:
 *         type: string
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
bazarsRouter.route("/orders").get(AdminBazarsController.getOrderesList);

/**
 * @swagger
 * /api/v1/admins/bazars/payment:
 *  post:
 *     tags:
 *       - Admin
 *     description:  Add payment way
 *     summary: Add payment way
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *               type:
 *                   type: string
 *               key:
 *                   type: string
 *               imgURL:
 *                type: string
 *                format: binary
 *            required:
 *               -type
 *               -key
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
bazarsRouter
  .route("/payment")
  .post(
    uploadHelper("Payments-Images/").single("imgURL"),
    AdminBazarsController.addPaymentWay
  );
/**
 * @swagger
 * /api/v1/admins/bazars/payment:
 *   get:
 *     tags:
 *       - Admin
 *     description:
 *     summary: Get availble Payment
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: isAd
 *         description: if request for ad payment send true
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: succeed
 */
bazarsRouter.route("/payment").get(AdminBazarsController.getPaymentWay);

/**
 * @swagger
 * /api/v1/admins/bazars/payment/switch/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     description: switch Payment on/off
 *     summary: switch Payment on/off
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: succeed
 */
bazarsRouter
  .route("/payment/switch/:id")
  .put(AdminBazarsController.switchPaymentWay);

bazarsRouter
  .route("/payment/elemination/")
  .delete(AdminBazarsController.deleteAllPaymentWay);

/**
 * @swagger
 * /api/v1/admins/bazars/offers/:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get all Offers
 *     summary: Get All Offers
 *     parameters:
 *      - in: header
 *        name: authentication
 *        description: authentication token
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *        200:
 *           description: Ok
 */
bazarsRouter.route("/offers").get(OfferController.getOffers);

/**
 * @swagger
 * /api/v1/admins/bazars/{id}/offers/:
 *   get:
 *     tags:
 *       - Admin
 *     description:  Get all offers for bazar
 *     summary: Get All offers for bazar
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: bazar id
 *      - in: header
 *        name: authentication
 *        description: authentication token
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *        200:
 *           description: Ok
 */
bazarsRouter.route("/:id/offers").get(OfferController.getStoreOffers);

/**
 * @swagger
 * /api/v1/admins/bazars/offers/{id}/elemenation/:
 *   put:
 *     tags:
 *       - Admin
 *     description:  delete offer
 *     summary: delete offer
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: offer id
 *      - in: header
 *        name: authentication
 *        description: authentication token
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *        200:
 *           description: Ok
 */
bazarsRouter.route("/offers/:id/elemenation").put(OfferController.deleteOffer);

const adminBazarFileName = __filename;
export { bazarsRouter, adminBazarFileName };
