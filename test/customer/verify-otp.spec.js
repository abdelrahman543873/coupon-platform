import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_REGISTER, VERIFY_OTP } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
import { verifyOTPRepository } from "../../src/verification/verification.repository.js";
describe("verify otp suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("verify otp service", async () => {
    const { role, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    //test right code
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: VERIFY_OTP,
      variables: { code: "1234" },
      token: res.body.data.authToken,
    });
    expect(res1.body.data).toBe(true);
    //test wrong code
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: VERIFY_OTP,
      variables: { code: "12345" },
      token: res.body.data.authToken,
    });
    expect(res2.body.statusCode).toBe(617);
  });
});