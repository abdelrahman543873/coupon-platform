import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_PAYMENT_TYPE } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { buildPaymentParams } from "../../src/payment/payment.factory.js";
describe("add payment type suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("add payment type successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildPaymentParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_PAYMENT_TYPE,
      variables,
      token: admin.token,
    });
    expect(res.body.data.payment.enName).toBe(variables.enName);
  });

  it("should throw an error if two payment types with same name", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildPaymentParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_PAYMENT_TYPE,
      variables,
      token: admin.token,
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_PAYMENT_TYPE,
      variables,
      token: admin.token,
    });
    expect(res1.body.statusCode).toBe(500);
  });
});
