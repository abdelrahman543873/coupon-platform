import { TermsAndConditionsEnum } from "../../src/terms-and-conditions/terms-and-conditions.enum.js";
import { termsAndConditionsFactory } from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { GET_TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForTermsAndConditions } from "./rollback-for-terms-and-conditions.js";
describe("get terms and conditions suite case", () => {
  afterEach(async () => {
    await rollbackDbForTermsAndConditions();
  });
  it("get terms and conditions", async () => {
    await termsAndConditionsFactory(1, { key: TermsAndConditionsEnum[0] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_TERMS_AND_CONDITIONS}?key=${TermsAndConditionsEnum[0]}`,
    });
    expect(res.body.data.length).toBe(1);
  });

  it("get provider terms and conditions", async () => {
    await termsAndConditionsFactory(1, { key: TermsAndConditionsEnum[1] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_TERMS_AND_CONDITIONS}?key=${TermsAndConditionsEnum[1]}`,
    });
    expect(res.body.data.length).toBe(1);
  });
});
