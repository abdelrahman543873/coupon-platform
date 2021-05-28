import { customerFactory } from "../../src/customer/customer.factory.js";
import { testRequest } from "../request.js";
import { LOGOUT } from "../endpoints/logout.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("customer logout suite case", () => {
  it("customer logout", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: LOGOUT,
      token: customer.token,
    });
    expect(res.body.success).toBe(true);
  });
});
