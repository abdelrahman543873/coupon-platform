import { Bank } from "../../middlewares/responsHandler";
import { AppBankModel } from "../models/appBanks";
import { BanksModule } from "../modules/bankAccounts";

let BankAccountController = {
  async add(req, res, next) {
    let account = req.body;
    let saveAccount = await BanksModule.addBankAccount(account);
    if (saveAccount.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: saveAccount.err,
      });
    }
    saveAccount = new Bank(saveAccount.doc);
    return res.status(200).send({
      isSuccessed: true,
      data: saveAccount,
      error: null,
    });
  },

  async getAll(req, res, next) {
    let banks = await BanksModule.getAll();
    banks = banks.map((bank) => {
      return new Bank(bank);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: banks,
      error: null,
    });
  },

  async getAllForAdmin(req, res, next) {
    let banks = await BanksModule.getAll(true);
    banks = banks.map((bank) => {
      return new Bank(bank);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: banks,
      error: null,
    });
  },

  async toggleBankAccount(req, res, next) {
    let id = req.params.id;
    let bank = await AppBankModel.findById(id);
    bank.isActive = !bank.isActive;
    bank = await bank.save().catch((err) => {
      return res.send({
        isSuccessed: false,
        data: null,
        err,
      });
    });

    return res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },
};
export { BankAccountController };
