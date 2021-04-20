import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { TOGGLE_BANK } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { bankFactory, buildBankParams } from "../../src/bank/bank.factory";
import { BankModel } from "../../src/bank/models/bank.model.js";
describe("update bank suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should update bank account", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const bank = await bankFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_BANK,
      variables: { bank: bank._id },
      token: admin.token,
    });
    const queriedBank = await BankModel.findOne({ _id: bank._id });
    expect(res.body.data).toBe(true);
    expect(queriedBank.isActive).toBe(false);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_BANK,
      variables: { bank: bank._id },
      token: admin.token,
    });
    const queriedBank1 = await BankModel.findOne({ _id: bank._id });
    expect(res1.body.data).toBe(true);
    expect(queriedBank1.isActive).toBe(true);
  });
});
