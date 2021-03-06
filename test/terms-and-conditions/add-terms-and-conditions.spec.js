import { termsAndConditionsModel } from "../../src/terms-and-conditions/models/terms-and-conditions.model.js";
import { TermsAndConditionsEnum } from "../../src/terms-and-conditions/terms-and-conditions.enum.js";
import { buildTermsAndConditionsParams } from "../../src/terms-and-conditions/terms-and-conditions.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
import { post, testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("add terms and conditions suite case", () => {
  it("add terms and conditions", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const params = await buildTermsAndConditionsParams({
      key: TermsAndConditionsEnum[2],
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TERMS_AND_CONDITIONS,
      variables: params,
      token: admin.token,
    });
    expect(res.body.data.enDescription).toBe(params.enDescription);
    await termsAndConditionsModel.deleteMany({
      key: TermsAndConditionsEnum[2],
    });
  });

  it("return error if arDescription doesn't exists", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const params = await buildTermsAndConditionsParams();
    delete params.arDescription;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TERMS_AND_CONDITIONS,
      variables: params,
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(400);
  });
});
