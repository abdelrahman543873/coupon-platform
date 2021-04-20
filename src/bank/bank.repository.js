import { BankModel } from "./models/bank.model.js";

export const addBankAccountRepository = async (bank) => {
  return await BankModel.create(bank);
};

export const rawDeleteBank = async () => {
  return await BankModel.deleteMany({});
};
