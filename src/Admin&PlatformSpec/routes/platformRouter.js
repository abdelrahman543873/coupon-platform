import { Router } from "express";
import { GeneralCityControllers } from "../controllers/PlatformSpec/city";
import { PassRequestsController } from "../controllers/PlatformSpec/passRequests";
import { passReqValidationware } from "../middlewares/validations/passRequests";

const platformSpecRouter = Router();

/**
 * @swagger
 *
 * /api/v1/platform/cities:
 *  get:
 *     summary: Get all cities
 *     description: Get all cities
 *     tags:
 *       - Cities
 *     responses:
 *       200:
 *         description: login
 */
platformSpecRouter.get("/cities", GeneralCityControllers.getCities);

/**
 * @swagger
 *
 * /api/v1/platform/cities/districts/{id}:
 *  get:
 *     summary: Get all districts for this city
 *     description: Get all districts for this city
 *     tags:
 *       - Cities
 *     parameters:
 *       - in: path
 *         name: id  # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

platformSpecRouter.get(
  "/cities/districts/:id",
  GeneralCityControllers.getDistricts
);

/**
 * @swagger
 *
 * /api/v1/platform/requests/mail/passwords/new:
 *  post:
 *     tags:
 *       - Passwords Requests
 *     description: forget password
 *     summary: send email to reset password
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              isProvider:
 *                type: boolean
 *            required:
 *              -email
 *              -isProvider
 *     responses:
 *       201:
 *         description: email sent
 */
platformSpecRouter
  .route("/requests/mail/passwords/new")
  .post(
    passReqValidationware.newPassMailReq,
    PassRequestsController.newPasswordMailRequest
  );

/**
 * @swagger
 *
 * /api/v1/platform/requests/mobile/passwords/new:
 *  post:
 *     tags:
 *       - Passwords Requests
 *     description: forget password
 *     summary: send code to reset password
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              mobile:
 *                type: string
 *              isProvider:
 *                type: boolean
 *            required:
 *              -email
 *              -isProvider
 *     responses:
 *       201:
 *         description: email sent
 */
platformSpecRouter
  .route("/requests/mobile/passwords/new")
  .post(
    passReqValidationware.newPassMobileReq,
    PassRequestsController.newPasswordMobileRequest
  );

/**
 * @swagger
 *
 * /api/v1/platform/requests/passwords/{code}:
 *  get:
 *     tags:
 *       - Passwords Requests
 *     description: forget password
 *     summary: confirm code
 *     parameters:
 *       - in: path
 *         name: code  # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: email sent
 */
platformSpecRouter
  .route("/requests/passwords/:code")
  .get(PassRequestsController.checkPassResettingCode);

/**
 * @swagger
 *
 * /api/v1/platform/requests/passwords/resetting:
 *  post:
 *     tags:
 *       - Passwords Requests
 *     description: reset password
 *     summary: reset password
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              -code
 *              -password
 *     responses:
 *       201:
 *         description: email sent
 */
platformSpecRouter
  .route("/requests/passwords/resetting")
  .post(PassRequestsController.changePassword);

let citiesFileName = __filename;
export { platformSpecRouter, citiesFileName };
