import {
  addTermsAndConditionsRepository,
  getTermsAndConditionsRepository,
} from "./terms-and-conditions.repository.js";

export const addTermsAndConditionsService = async (req, res) => {
  const termsAndConditions = await addTermsAndConditionsRepository(req.body);
  res.send(termsAndConditions);
};

export const getTermsAndConditionsService = async (req, res) => {
  const termsAndConditions = await getTermsAndConditionsRepository();
  res.send(termsAndConditions);
};
