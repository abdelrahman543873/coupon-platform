import { termsAndConditionsModel } from "./models/terms-and-conditions.model.js";
export const addTermsAndConditionsRepository = async (termsAndConditions) => {
  return await termsAndConditionsModel.create(termsAndConditions);
};

export const getTermsAndConditionsRepository = async (key) => {
  return await termsAndConditionsModel.find({
    key,
  });
};

export const updateTermsAndConditionsRepository = async ({
  termsAndConditions,
}) => {
  return await termsAndConditionsModel.findOneAndUpdate(
    { _id: termsAndConditions.termsAndConditions },
    termsAndConditions,
    {
      lean: true,
      new: true,
    }
  );
};

export const rawDeleteTermsAndConditions = async () => {
  return await termsAndConditionsModel.deleteMany({});
};
