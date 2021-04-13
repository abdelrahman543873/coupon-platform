import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GET_PAYMENT_TYPES } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { paymentsFactory } from "../../src/payment/payment.factory.js";
describe("get payment types suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("get payment types successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await paymentsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PAYMENT_TYPES,
      token: admin.token,
    });
    expect(res.body.data.payments.docs.length).toBe(10);
  });
});
