import express from "express";
import { BankAccountController } from "../../controllers/bank.js";

const bankAccountRouter = express.Router();

bankAccountRouter.route("/").get(BankAccountController.getAll);

export { bankAccountRouter };
