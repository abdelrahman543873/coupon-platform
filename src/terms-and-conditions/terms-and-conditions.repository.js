import { termsAndConditionsModel } from "./models/terms-and-conditions.model.js";
export const addTermsAndConditionsRepository = async (termsAndConditions) => {
  return await termsAndConditionsModel.create(termsAndConditions);
};

export const getTermsAndConditionsRepository = async () => {
  return await termsAndConditionsModel.find({});
};

export const rawDeleteTermsAndConditions = async () => {
  return await termsAndConditionsModel.deleteMany({});
};
