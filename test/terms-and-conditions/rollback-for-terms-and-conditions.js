import { rawDeleteTermsAndConditions } from "../../src/terms-and-conditions/terms-and-conditions.repository.js";
export async function rollbackDbForTermsAndConditions() {
  await rawDeleteTermsAndConditions();
}
