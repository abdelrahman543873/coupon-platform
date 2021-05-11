import { UserRoleEnum } from "../user/user-role.enum.js";
import { termsAndConditionsModel } from "./models/terms-and-conditions.model.js";
export const addTermsAndConditionsRepository = async (termsAndConditions) => {
  return await termsAndConditionsModel.create(termsAndConditions);
};

export const getTermsAndConditionsRepository = async (user) => {
  return await termsAndConditionsModel.find({
    ...(user && { key: user }),
    ...(!user && { key: UserRoleEnum[1] }),
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
