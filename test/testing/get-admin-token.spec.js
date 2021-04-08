import { buildTermsAndConditionsParams } from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { GET_ADMIN_TOKEN } from "../endpoints/testing.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForTesting } from "./rollback-for-testing.js";
describe("get admin token suite case", () => {
  afterEach(async () => {
    await rollbackDbForTesting();
  });
  it("get admin token suite case", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_ADMIN_TOKEN,
    });
    expect(res.body.authToken).toBeTruthy();
  });
});
