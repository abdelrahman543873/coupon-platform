import faker from "faker";
import { BankModel } from "./models/bank.model.js";

export const buildBankParams = (obj = {}) => {
  return {
    accountNumber: obj.accountNumber || faker.finance.account(),
    bankName: obj.bankName || faker.commerce.productName(),
    agentName: obj.agentName || faker.commerce.productName(),
    city: obj.city || faker.address.city(),
    country: obj.country || faker.address.country(),
    swiftCode: obj.swiftCode || faker.finance.iban(),
    isActive: obj.isActive || true,
  };
};

export const banksFactory = async (count = 10, obj = {}) => {
  const banks = [];
  for (let i = 0; i < count; i++) {
    banks.push(buildBankParams(obj));
  }
  return await BankModel.collection.insertMany(banks);
};

export const bankFactory = async (obj = {}) => {
  const params = buildBankParams(obj);
  return await BankModel.create(params);
};
