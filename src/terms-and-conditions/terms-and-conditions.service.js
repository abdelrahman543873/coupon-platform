import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  addTermsAndConditionsRepository,
  getTermsAndConditionsRepository,
  updateTermsAndConditionsRepository,
} from "./terms-and-conditions.repository.js";

export const addTermsAndConditionsService = async (req, res, next) => {
  try {
    const termsAndConditions = await addTermsAndConditionsRepository(req.body);
    res.status(200).json({ success: true, data: termsAndConditions });
  } catch (error) {
    next(error);
  }
};

export const updateTermsAndConditionsService = async (req, res, next) => {
  try {
    const termsAndConditions = await updateTermsAndConditionsRepository({
      termsAndConditions: req.body,
    });
    if (!termsAndConditions) throw new BaseHttpError(652);
    res.status(200).json({ success: true, data: termsAndConditions });
  } catch (error) {
    next(error);
  }
};

export const getTermsAndConditionsService = async (req, res, next) => {
  try {
    const termsAndConditions = await getTermsAndConditionsRepository(
      req.query.key
    );
    res.status(200).json({ success: true, data: termsAndConditions });
  } catch (error) {
    next(error);
  }
};
