import { termsAndConditionsFactory } from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { GET_TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
import { get } from "../request.js";
import { rollbackDbForTermsAndConditions } from "./rollback-for-terms-and-conditions.js";
describe("get terms and conditions suite case", () => {
  afterEach(async () => {
    await rollbackDbForTermsAndConditions();
  });
  it("get terms and conditions", async () => {
    await termsAndConditionsFactory();
    const res = await get({
      url: GET_TERMS_AND_CONDITIONS,
    });
    expect(res.body.length).toBe(10);
  });
});
