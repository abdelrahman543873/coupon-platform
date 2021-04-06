import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_REGISTER, RESEND_CODE } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
describe("resend otp suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("should resend otp successfully", async () => {
    const { role, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: RESEND_CODE,
      token: res.body.data.authToken,
    });
    expect(res2.body.data).toBe(true);
  });
});
