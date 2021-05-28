import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GET_BANK_ACCOUNTS } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { banksFactory } from "../../src/bank/bank.factory";
describe("get bank accounts suite case", () => {
  it("get bank accounts", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const banks = await banksFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_BANK_ACCOUNTS,
      token: admin.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
