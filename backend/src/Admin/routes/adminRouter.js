import express, { Router } from "express";
import { AdminsController } from "../controllers/Admin/admin";
import { citiesRouter } from "./Admin/cities";
import { bazarsRouter } from "./Admin/bazars";
import { AdminsAuth } from "../middlewares/auth";
import { adminValidationwar } from "../middlewares/validations/admin";
import { questionValidationwar } from "../middlewares/validations/familiarQuestions";
import { packageValidationnwar } from "../middlewares/validations/adsPackages";
import { AdsController } from "../../ProviderManagement/controllers/Ads";

const adminRouter = Router();

adminRouter.route("/").post(AdminsAuth.isAdmin, AdminsController.add);

/**
 * @swagger
 *
 * /api/v1/admins/auth:
 *  post:
 *     description: login
 *     summary: login
 *     tags:
 *       - Admin
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
adminRouter
  .route("/auth")
  .post(adminValidationwar.login, AdminsController.login);

adminRouter.route("/new").post(adminValidationwar.add, AdminsController.add);

/**
 * @swagger
 *
 * /api/v1/admins/questions/new:
 *  post:
 *     description: add question
 *     summary: add question
 *     tags:
 *       - Admin
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              questionAr:
 *                type: string
 *              answerAr:
 *                type: string
 *              questionEn:
 *                type: string
 *              answerEn:
 *                type: string
 *              type:
 *                type: string
 *            required:
 *              -questionAr
 *              -answerAr
 *              -questionEn
 *              -answerEn
 *              -type
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/questions/new")
  .post(
    AdminsAuth.isEditorOrHigher,
    questionValidationwar.addQuestion,
    AdminsController.addQustion
  );

/**
 * @swagger
 *
 * /api/v1/admins/questions:
 *  get:
 *     tags:
 *       - Admin
 *     description: Get FQA
 *     summary: Get FQA
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         description:  type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/questions")
  .get(AdminsAuth.isEditorOrHigher, AdminsController.getFamiliarQuestions);

/**
 * @swagger
 *
 * /api/v1/admins/adsPackages/new:
 *  post:
 *     description: add package
 *     summary: add package
 *     tags:
 *       - Admin
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              price:
 *                type: integer
 *              totalDayes:
 *                type: integer
 *              descAr:
 *                type: string
 *              descEn:
 *                type: string
 *            required:
 *              -price
 *              -totalDayes
 *              -descAr
 *              -descEn
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/adsPackages/new")
  .post(
    AdminsAuth.isEditorOrHigher,
    packageValidationnwar.addPackage,
    AdminsController.addPackage
  );

/**
 * @swagger
 *
 * /api/v1/admins/adsPackages:
 *  get:
 *     tags:
 *       - Admin
 *     description: Get package
 *     summary: Get package
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/adsPackages")
  .get(AdminsAuth.isEditorOrHigher, AdminsController.getPackages);

/**
 * @swagger
 *
 * /api/v1/admins/adsPackages/{id}/switch:
 *  post:
 *     tags:
 *       - Admin
 *     description: set package on/off
 *     summary: set package on/off
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
 *         description:  package id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/adsPackages/:id/switch")
  .post(AdminsAuth.isEditorOrHigher, AdminsController.setPackagesOff);

/**
 * @swagger
 *
 * /api/v1/admins/app/cridit/modification:
 *  put:
 *     tags:
 *       - Admin
 *     description: update cridit account
 *     summary: update cridit account
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
 *            required:
 *              -merchantEmail
 *              -secretKey
 *     parameters:
 *       - in: header
 *         name: authentication
 *         required: true
 *         description:  admin authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/app/cridit/modification")
  .put(AdminsAuth.isEditorOrHigher, AdminsController.updateCriditAcount);

adminRouter.use("/cities", AdminsAuth.isEditorOrHigher, citiesRouter);
adminRouter.use("/bazars", AdminsAuth.isEditorOrHigher, bazarsRouter);

/**
 * @swagger
 *
 * /api/v1/admins/app/banks/:
 *  post:
 *     tags:
 *       - Admin
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
 *              swiftCode:
 *                type: string
 *            required:
 *              -accountNumber
 *              -bankName
 *              -bankAgentName
 *              -city
 *              -country
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
adminRouter
  .route("/app/banks")
  .post(
    AdminsAuth.isEditorOrHigher,
    adminValidationwar.addBank,
    AdminsController.addBanckAccount
  );

/**
 * @swagger
 *
 * /api/v1/admins/app/banks/{id}/switch:
 *  post:
 *     tags:
 *       - Admin
 *     description: set Bank Account on/off
 *     summary:  set Bank Account on/off
 *     parameters:
 *       - in: header
 *         name: authentication
 *         description: authentication token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         description: Bank id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: login
 */
adminRouter
  .route("/app/banks/:id/switch")
  .post(AdminsAuth.isEditorOrHigher, AdminsController.toggleBankAccount);

/**
 * @swagger
 *
 * /api/v1/admins/app/banks:
 *  get:
 *     tags:
 *       - Admin
 *     description: get Bank Accounts
 *     summary:  get Bank Accounts
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
adminRouter
  .route("/app/banks")
  .get(AdminsAuth.isEditorOrHigher, AdminsController.getBanks);

adminRouter.use(
  "/payments/adsPayments-images/",
  express.static("AdsPayments-Images")
);

const adminFileName = __filename;

export { adminRouter, adminFileName };
