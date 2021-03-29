import {
  addTermsAndConditionsRepository,
  getTermsAndConditionsRepository,
} from "./terms-and-conditions.repository.js";

export const addTermsAndConditionsService = async (req, res, next) => {
  try {
    const termsAndConditions = await addTermsAndConditionsRepository(req.body);
    res.send(termsAndConditions);
  } catch (error) {
    next(error);
  }
};

export const getTermsAndConditionsService = async (req, res) => {
  try {
    const termsAndConditions = await getTermsAndConditionsRepository();
    res.send(termsAndConditions);
  } catch (error) {
    next(error);
  }
};
