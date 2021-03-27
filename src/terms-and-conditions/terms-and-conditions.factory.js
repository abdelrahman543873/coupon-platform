import faker from "faker";
import { termsAndConditionsModel } from "./models/terms-and-conditions.model.js";

export const buildTermsAndConditionsParams = (obj = {}) => {
  return {
    enDescription: obj.enDescription || faker.commerce.productDescription(),
    arDescription: obj.arDescription || faker.commerce.productDescription(),
  };
};

export const termsAndConditionsFactory = async (count = 10, obj = {}) => {
  const termsAndConditions = [];
  for (let i = 0; i < count; i++) {
    termsAndConditions.push(buildTermsAndConditionsParams(obj));
  }
  return await termsAndConditionsModel.collection.insertMany(
    termsAndConditions
  );
};

export const termsAndConditionFactory = async (obj = {}) => {
  const params = buildTermsAndConditionsParams(obj);
  const termsAndConditions = await termsAndConditionsModel.create(params);
  return termsAndConditions;
};
