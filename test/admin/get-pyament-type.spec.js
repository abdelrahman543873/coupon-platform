import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GET_PAYMENT_TYPE } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { paymentFactory } from "../../src/payment/payment.factory.js";
describe("get payment types suite case", () => {
  it("get payment types successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const payment = await paymentFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PAYMENT_TYPE,
      token: admin.token,
      variables: { payment: payment._id },
    });
    expect(res.body.data._id).toBe(decodeURI(encodeURI(payment._id)));
  });
});
