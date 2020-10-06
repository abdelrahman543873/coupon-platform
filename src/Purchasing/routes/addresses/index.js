import { Router } from "express";
import { AddressesController } from "../../controllers/addresses";
import { checkCustomerAuth } from "../../../CustomersManagement/middlewares/auth";
import { AddressesValidationwar } from "../../middlewares/validations/addresses";

// api/v1/purchasing-management/addresses
const addressesRouter = Router();
const userAddressesFilename = __filename;

/**
 * @swagger
 *
 * /api/v1/purchasing-management/addresses:
 *  post:
 *     description: add user address
 *     summary: add delivery address to user
 *     tags:
 *       - Addresses
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              city:
 *                type: string
 *              district:
 *                type: string
 *              street:
 *                type: string
 *              addressName:
 *                type: string
 *              buildingNo:
 *                type: string
 *              floorNo:
 *                type: string
 *              isMainAddress:
 *                type: boolean
 *              lat:
 *                type: number
 *              lng:
 *                type: number
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: added
 *  get:
 *     description: get user addresses
 *     summary: get user delivery addresses
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: get addresses
 */
addressesRouter
  .route("/")
  .post(AddressesValidationwar.add, checkCustomerAuth, AddressesController.add)
  .get(checkCustomerAuth, AddressesController.getUserAddresses);

/**
 * @swagger
 *
 * /api/v1/purchasing-management/addresses/{id}/setMain/:
 *  post:
 *     description: set main address
 *     summary: set main address
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: address id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: get addresses
 */
addressesRouter
  .route("/:id/setMain")
  .post(checkCustomerAuth, AddressesController.setMainAdress)




  /**
 * @swagger
 *
 * /api/v1/purchasing-management/addresses/{id}/modification:
 *  post:
 *     description: edit user address
 *     summary: edit user address
 *     tags:
 *       - Addresses
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              city:
 *                type: string
 *              district:
 *                type: string
 *              street:
 *                type: string
 *              addressName:
 *                type: string
 *              buildingNo:
 *                type: string
 *              floorNo:
 *                type: string
 *              lat:
 *                type: number
 *              lng:
 *                type: number
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: address id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: added
 */
addressesRouter
  .route("/:id/modification")
  .post(
    AddressesValidationwar.editAddress,
    checkCustomerAuth,
    AddressesController.editAddress
  );

    /**
 * @swagger
 *
 * /api/v1/purchasing-management/addresses/{id}/elimination:
 *  post:
 *     description: delete user address
 *     summary: delete user address
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: address id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: added
 */
addressesRouter
  .route("/:id/elimination")
  .post(
    checkCustomerAuth,
    AddressesController.deleteAddress
  );

export { addressesRouter, userAddressesFilename };
