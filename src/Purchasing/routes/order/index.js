import express,{ Router } from "express";
import { checkCustomerAuth } from "../../../CustomersManagement/middlewares/auth";
import { OrderValidationWare } from "../../middlewares/validations/order";
import { OrderContoller } from "../../controllers/order";

const orderRouter = Router();
const orderFileName = __filename;

/**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/client/{id}/new/:
 *  post:
 *     tags:
 *       - Customers
 *     description: Create Order
 *     summary: Create Order
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: bazar id
 *                type: string
 *              paymentType:
 *                description: must be COD, FAWRY, ONLINE PAYMENT , BANK TRANSFER
 *                type: string
 *              deliveryAddress:
 *                description: client Adress
 *                type: string
 *              products:
 *                description: products
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    product:
 *                      type: string
 *                    quantity:
 *                      type: integer
 *              total:
 *                description: order total
 *                type: integer
 *            required:
 *              -bazar
 *              -paymentType
 *              -deliveryAddress
 *              -products
 *              -total
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
 *     responses:
 *       200:
 *         description: login
 */
orderRouter
  .route("/client/:id/new")
  .post(
    checkCustomerAuth,
    OrderValidationWare.addOrder,
    OrderContoller.addOrder
  );

/**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/client/{id}/:
 *  get:
 *     tags:
 *       - Customers
 *     description: get customer oreders
 *     summary: get customer oreders
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
 *         name: state
 *         description: must be CONFIRMATION PENDING , REFUSED , PAYMENT PENDING , ACCEPTED , CANCELED , SHIPPED TO USER ADDRESS , DELIVERED
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
orderRouter
  .route("/client/:id")
  .get(checkCustomerAuth, OrderContoller.getOrders);

/**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/{id}/canceling/:
 *  post:
 *     tags:
 *       - Customers
 *     description: cancel order
 *     summary: cancel order
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: order id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
orderRouter
  .route("/:id/canceling/")
  .post(checkCustomerAuth, OrderContoller.orderCanceling);

/**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/bazars/{id}/payments:
 *  get:
 *     tags:
 *       - Customers
 *     description: get payments ways
 *     summary: get payments ways
 *     parameters:
 *       - in: path
 *         name: id
 *         description: bazar id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
orderRouter
  .route("/bazars/:id/payments")
  .get(OrderContoller.getBazarPaymentWays);

  /**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/{id}:
 *  get:
 *     tags:
 *       - Customers
 *       - Provider
 *     description: get order by id
 *     summary: get order by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: order id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
orderRouter.route("/:id").get(OrderContoller.getOrder);

/**
 * @swagger
 *
 * /api/v1/purchasing-management/orders/payments/{id}:
 *  get:
 *     tags:
 *       - Customers
 *       - Provider
 *     description: get payment by id
 *     summary: get payment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: order id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
orderRouter.route("/payments/:id").get(OrderContoller.getPayment);

orderRouter.use("/payments/payments-images", express.static("Payments-Images"));

export { orderFileName, orderRouter };
