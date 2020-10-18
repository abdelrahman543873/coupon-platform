import { Router } from "express";
import { AdminCityControllers } from "../../controllers/Admin/city";
import { cityValidationware } from "../../middlewares/validations/city";

const citiesRouter = Router();


/**
 * @swagger
 *
 * /api/v1/admins/cities/new:
 *  post:
 *     summary: Add city
 *     description: Add city
 *     tags:
 *       - Admin
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              name:
 *                type: object
 *                properties:
 *                  arabic:
 *                      description: name arabic
 *                      type: string
 *                  english:
 *                      description: name english
 *                      type: string
 *                required:
 *                  -arabic
 *                  -english
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
citiesRouter
  .route("/new")
  .post(cityValidationware.addCity, AdminCityControllers.addCity);

citiesRouter
  .route("/:id/districts/:districtId")
  .delete(AdminCityControllers.deleteDistrict);

  /**
 * @swagger
 *
 * /api/v1/admins/cities/{id}/districts:
 *  post:
 *     tags:
 *       - Admin
 *     description: Add districts
 *     summary: Add districts
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              districts:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: object
 *                      properties:
 *                        arabic:
 *                          description: name arabic
 *                          type: string
 *                        english:
 *                          description: name english
 *                          type: string
 *                  required:
 *                    -arabic
 *                    -english
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: city id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */

citiesRouter
  .route("/:id/districts")
  .post(cityValidationware.addDistricts, AdminCityControllers.addDistricts);

const adminCityFileName = __filename;
export { citiesRouter, adminCityFileName };
