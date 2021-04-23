import { CreditModel } from "./models/credit.model.js";

export const updateCreditRepository = async ({ bank }) => {
  return await CreditModel.findOneAndUpdate({ _id: bank._id }, bank, {
    lean: true,
    new: true,
  });
};

export const getCreditRepository = async () => {
  return await CreditModel.findOne({}, {}, { lean: true });
};

export const addCreditRepository = async ({ bank }) => {
  return await CreditModel.create(bank);
};

export const rawDeleteCredit = async () => {
  return await CreditModel.deleteMany({});
};
