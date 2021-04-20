import { BankModel } from "./models/bank.model.js";

export const addBankAccountRepository = async (bank) => {
  return await BankModel.create(bank);
};

export const updateBankAccountRepository = async ({ _id, bank }) => {
  return await BankModel.findOneAndUpdate({ _id }, bank, {
    new: true,
    lean: true,
  });
};

export const getBankAccountRepository = async ({ _id }) => {
  return await BankModel.findOne({ _id }, {}, { lean: true });
};

export const rawDeleteBank = async () => {
  return await BankModel.deleteMany({});
};
