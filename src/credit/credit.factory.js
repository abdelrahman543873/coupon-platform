import faker from "faker";
import { CreditModel } from "./models/credit.model.js";

export const buildCreditParams = (obj = {}) => {
  return {
    merchantEmail: obj.merchantEmail || faker.internet.email(),
    secretKey: obj.secretKey || faker.finance.iban(),
  };
};

export const creditsFactory = async (count = 10, obj = {}) => {
  const credits = [];
  for (let i = 0; i < count; i++) {
    credits.push(buildCreditParams(obj));
  }
  return await CreditModel.collection.insertMany(credits);
};

export const creditFactory = async (obj = {}) => {
  const params = buildCreditParams(obj);
  return await CreditModel.create(params);
};
