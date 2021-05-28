import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { TOGGLE_PAYMENT_TYPE } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { paymentFactory } from "../../src/payment/payment.factory.js";
describe("toggle payment type suite case", () => {
  it("toggle payment type successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const paymentType = await paymentFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_PAYMENT_TYPE,
      variables: { paymentTypeId: paymentType.id },
      token: admin.token,
    });
    expect(res.body.data.paymentType.isActive).toBe(false);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_PAYMENT_TYPE,
      variables: { paymentTypeId: paymentType.id },
      token: admin.token,
    });
    expect(res1.body.data.paymentType.isActive).toBe(true);
  });
});
