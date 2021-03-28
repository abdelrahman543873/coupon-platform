import { addTermsAndConditionsRepository, getTermsAndConditionsRepository } from "./terms-and-conditions.repository.js";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { TermsAndConditionsInput } from "./inputs/terms-and-conditions.input.js";
export const addTermsAndConditionsService = async (req, res) => {
  await validateOrReject(plainToClass(TermsAndConditionsInput, req.body), {
    stopAtFirstError: true
  });
  const termsAndConditions = await addTermsAndConditionsRepository(req.body);
  res.send(termsAndConditions);
};
export const getTermsAndConditionsService = async (req, res) => {
  const termsAndConditions = await getTermsAndConditionsRepository();
  res.send(termsAndConditions);
};