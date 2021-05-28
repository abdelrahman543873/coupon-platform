import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_REGISTER, VERIFY_OTP } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
describe("verify otp suite case", () => {
  it("verify otp service", async () => {
    const { role, fcmToken, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    //test right code
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: VERIFY_OTP,
      variables: { code: "12345" },
      token: res.body.data.authToken,
    });
    expect(res1.body.data.user.isVerified).toBe(true);
    expect(res1.body.data.authToken).toBeTruthy();
    //test wrong code
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: VERIFY_OTP,
      variables: { code: "123456" },
      token: res.body.data.authToken,
    });
    expect(res2.body.statusCode).toBe(617);
  });
});
