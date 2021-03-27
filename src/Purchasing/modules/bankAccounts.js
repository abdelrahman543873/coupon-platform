import { AppBankModel } from "../models/appBanks.js";

let BanksModule = {
  async addBankAccount(bank) {
    return await AppBankModel({ ...bank })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          doc: null,
          err,
        };
      });
  },
  async getAll(isAdmin = null) {
    let queryOp = {};
    queryOp.isActive = true;
    isAdmin == "true" || isAdmin == true ? delete queryOp.isActive : "";
    return await AppBankModel.find({ ...queryOp });
  },
};
export { BanksModule };
