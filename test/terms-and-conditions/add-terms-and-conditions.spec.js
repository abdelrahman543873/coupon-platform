import { buildTermsAndConditionsParams } from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { ADD_TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
import { post } from "../request.js";
import { rollbackDbForTermsAndConditions } from "./rollback-for-terms-and-conditions.js";
describe("add terms and conditions suite case", () => {
  afterEach(async () => {
    await rollbackDbForTermsAndConditions();
  });
  it("add terms and conditions", async () => {
    const params = await buildTermsAndConditionsParams();
    const res = await post({
      url: ADD_TERMS_AND_CONDITIONS,
      variables: params,
    });
    expect(res.body.enDescription).toBe(params.enDescription);
  });

  // it("return error if arDescription doesn't exists", async () => {
  //   const params = await buildTermsAndConditionsParams();
  //   delete params.arDescription;
  //   const res = await post({
  //     url: ADD_TERMS_AND_CONDITIONS,
  //     variables: params,
  //   });
  //   console.log(res.body);
  // });
});
