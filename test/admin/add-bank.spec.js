import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_BANK } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { buildBankParams } from "../../src/bank/bank.factory";
describe("add bank suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should add bank account", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildBankParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_BANK,
      variables,
      token: admin.token,
    });
    expect(res.body.data.accountNumber).toBe(variables.accountNumber);
  });
});
