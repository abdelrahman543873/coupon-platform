import {
  buildTermsAndConditionsParams,
  termsAndConditionFactory,
} from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UPDATE_TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForTermsAndConditions } from "./rollback-for-terms-and-conditions.js";
describe("add terms and conditions suite case", () => {
  afterEach(async () => {
    await rollbackDbForTermsAndConditions();
  });
  it("update terms and conditions", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const termsAndConditions = await termsAndConditionFactory();
    delete termsAndConditions._id;
    const params = await buildTermsAndConditionsParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_TERMS_AND_CONDITIONS,
      variables: { ...params, key: termsAndConditions.key },
      token: admin.token,
    });
    expect(res.body.data.enDescription).toBe(params.enDescription);
  });

  it("error if terms and conditions key don't exist", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const params = await buildTermsAndConditionsParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_TERMS_AND_CONDITIONS,
      variables: { ...params },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(652);
  });
});
