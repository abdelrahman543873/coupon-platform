import express from "express";
import { isIdAuthMathces } from "../../middlewares/auth";
import { OfferValidationWares } from "../../middlewares/validation/offers";
import { OfferController } from "../../controllers/offers";
import { uploadHelper } from "../../../utils/MulterHelper";
import { checkCustomerAuth } from "../../../CustomersManagement/middlewares/auth";

const offersRouter = express.Router();
let offersFileName = __filename;

/**
 * @swagger
 *
 * /api/v1/products/offers/new:
 *  post:
 *     tags:
 *       - Provider
 *     description: Create New offer
 *     summary: Create New offer
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *              descAr:
 *                description: description in arabic
 *                type: string
 *              descEn:
 *                description: description in english
 *                type: string
 *              type:
 *                description: ALL / ONE
 *                type: string
 *              discount:
 *                type: integer
 *              product:
 *                type: string
 *              totalDayes:
 *                type: integer
 *              imgURL:
 *                type: string
 *                format: binary
 *            required:
 *              -bazar
 *              -descAr
 *              -descEn
 *              -type
 *              -discount
 *              -totalDayes
 *              -imgURL
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
offersRouter
  .route("/new")
  .post(
    uploadHelper("Offers-Images/").single("imgURL"),
    isIdAuthMathces,
    OfferValidationWares.addOffer,
    OfferController.addOffer
  );

/**
 * @swagger
 * /api/v1/products/offers/:
 *   get:
 *     tags:
 *       - Customers
 *     description:  Get all Offers
 *     summary: Get All Offers
 *     responses:
 *        200:
 *           description: Ok
 */
offersRouter.route("/").get(OfferController.getOffers);

/**
 * @swagger
 * /api/v1/products/offers/bazar/{id}:
 *   get:
 *     tags:
 *       - Customers
 *       - Provider
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
offersRouter
  .route("/bazar/:id")
  .get(checkCustomerAuth, OfferController.getStoreOffers);

/**
 * @swagger
 * /api/v1/products/offers/{id}/elemenation/:
 *   put:
 *     tags:
 *       - Provider
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
offersRouter
  .route("/:id/elemenation")
  .put(checkCustomerAuth, OfferController.deleteOffer);

offersRouter.use("/offers-images", express.static("Offers-Images"));

export { offersRouter, offersFileName };
