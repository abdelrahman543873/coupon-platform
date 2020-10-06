import express from "express";
import multer from "multer";
import path from "path";
import { uploadHelper } from "../../../utils/MulterHelper";
import { ProductValidationWares } from "../../middlewares/validation/product";
import { ProductController } from "../../controllers/product";
import { isIdAuthMathces } from "../../middlewares/auth";

const productRouter = express.Router();
let productFileName = __filename;

/**
 * @swagger
 *
 * /api/v1/products/product/providers/new:
 *  post:
 *     tags:
 *       - Provider
 *     description: Create New Product
 *     summary: Create New Product
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *              nameEn:
 *                description: title in english
 *                type: string
 *              nameAr:
 *                description: title in arabic
 *                type: string
 *              descriptionEn:
 *                description: description in english
 *                type: string
 *              descriptionAr:
 *                description: description in arabic
 *                type: string
 *              price:
 *                type: integer
 *              productCover:
 *                description: Product Main Img (required)
 *                type: string
 *                format: binary
 *              productImages:
 *                description: Product other Imgs (not required)
 *                type: array
 *                items:
 *                  type: file
 *                  format: binary
 *            required:
 *              -bazar
 *              -nameEn
 *              -nameAr
 *              -descriptionEn
 *              -descriptionAr
 *              -price
 *              -productCover
 *
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
productRouter
  .route("/providers/new")
  .post(
    uploadHelper("Products-Images/").fields([
      { name: "productCover" },
      { name: "productImages" },
    ]),
    isIdAuthMathces,
    ProductValidationWares.addProduct,
    ProductController.addProduct
  );

/**
 * @swagger
 * /api/v1/products/product/:
 *   get:
 *     tags:
 *       - Customers
 *     description:  Get all products
 *     summary: Get All products
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Product Name (ar/en)
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: pagination limit
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *        description: pagination skip
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
productRouter.route("/").get(ProductController.getProducts);

/**
 * @swagger
 * /api/v1/products/product/{id}:
 *   get:
 *     tags:
 *       - Customers
 *     description:  Get all products for bazar
 *     summary: Get All products for bazar
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
productRouter.route("/:id").get(ProductController.getStoreProducts);

/**
 * @swagger
 *
 * /api/v1/products/product/modification/:
 *  put:
 *     tags:
 *       - Provider
 *     description: Update Product
 *     summary: Update Product
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              bazar:
 *                description: required bazar id
 *                type: string
 *              nameEn:
 *                description: title in english
 *                type: string
 *              nameAr:
 *                description: title in arabic
 *                type: string
 *              descriptionEn:
 *                description: description in english
 *                type: string
 *              descriptionAr:
 *                description: description in arabic
 *                type: string
 *              price:
 *                type: integer
 *              productCover:
 *                description: Product Main Img
 *                type: string
 *                format: binary
 *              productImages:
 *                description: Product other Imgs
 *                type: array
 *                items:
 *                  type: file
 *                  format: binary
 *              deleteImg:
 *                description: delete Products  Imgs 
 *                type: array
 *                items:
 *                  type: string
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
 *         description: productId
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
productRouter
  .route("/modification/")
  .put(
    uploadHelper("Products-Images/").fields([
      { name: "productCover" },
      { name: "productImages" },
    ]),
    isIdAuthMathces,
    ProductValidationWares.updateProduct,
    ProductController.updateProduct
  );

/**
 * @swagger
 *
 * /api/v1/products/product/elemination/:
 *  put:
 *     tags:
 *       - Provider
 *     description: Delete Product
 *     summary: Delete Product
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
 *             -bazar
 *     parameters:
 *       - in: header
 *         description: required auth token
 *         name: authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         description: product id
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
productRouter
  .route("/elemination")
  .put(isIdAuthMathces, ProductController.deleteProduct);

productRouter.use("/products-images", express.static("Products-Images"));
export { productRouter, productFileName };
