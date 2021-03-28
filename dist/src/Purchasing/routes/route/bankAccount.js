import express, { Router } from "express";
import { BankAccountController } from "../../controllers/bank.js";
const bankAccountRouter = Router();
bankAccountRouter.route("/").get(BankAccountController.getAll);
export { bankAccountRouter };