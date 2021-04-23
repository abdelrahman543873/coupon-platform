import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_CREDIT } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { buildCreditParams } from "../../src/credit/credit.factory";
describe("add credit suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should add credit account", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const variables = await buildCreditParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CREDIT,
      variables,
      token: admin.token,
    });
    expect(res.body.data.merchantEmail).toBe(variables.merchantEmail);
  });
});
