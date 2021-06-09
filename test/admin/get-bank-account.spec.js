import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GET_BANK_ACCOUNT } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { bankFactory } from "../../src/bank/bank.factory";
describe("get bank account suite case", () => {
  it("get bank account", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const bank = await bankFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_BANK_ACCOUNT}?bank=${bank._id}`,
      token: admin.token,
    });
    expect(res.body.data._id).toBe(decodeURI(encodeURI(bank._id)));
  });
});
